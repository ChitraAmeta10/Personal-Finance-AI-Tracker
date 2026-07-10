import io

CSV_CONTENT = (
    b"Date,Description,Amount\n"
    b"2026-07-01,TRADER JOE'S #123,-54.23\n"
    b"2026-07-01,STARBUCKS,-4.50\n"
    b"2026-07-01,STARBUCKS,-4.50\n"
    b"2026-07-02,PAYCHECK,2500.00\n"
)


def signup(client, email="alice@example.com"):
    client.post("/auth/register", json={"email": email, "password": "s3cret-pass"})
    token = client.post("/auth/login", data={"username": email, "password": "s3cret-pass"}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_account(client, headers) -> str:
    resp = client.post("/accounts", json={"name": "Checking", "account_type": "checking"}, headers=headers)
    assert resp.status_code == 201
    return resp.json()["id"]


def upload(client, headers, account_id, content=CSV_CONTENT, filename="statement.csv"):
    return client.post(
        "/uploads",
        data={"account_id": account_id},
        files={"file": (filename, io.BytesIO(content), "text/csv")},
        headers=headers,
    )


def test_create_and_list_accounts(client):
    headers = signup(client)
    create_account(client, headers)
    resp = client.get("/accounts", headers=headers)
    assert resp.status_code == 200
    assert resp.json()[0]["name"] == "Checking"


def test_upload_imports_transactions(client):
    headers = signup(client)
    account_id = create_account(client, headers)
    resp = upload(client, headers, account_id)
    assert resp.status_code == 201
    body = resp.json()
    assert body["status"] == "completed"
    assert body["total_rows"] == 4
    assert body["imported_rows"] == 4  # incl. both identical Starbucks rows
    assert body["duplicate_rows"] == 0

    txns = client.get("/transactions", headers=headers).json()
    assert len(txns) == 4
    trader_joes = next(t for t in txns if "TRADER" in t["merchant_raw"])
    assert trader_joes["merchant_normalized"] == "Trader Joe's"
    assert trader_joes["amount"] == "-54.23"
    assert trader_joes["categorization_source"] == "uncategorized"


def test_reupload_is_idempotent(client):
    headers = signup(client)
    account_id = create_account(client, headers)
    upload(client, headers, account_id)
    resp = upload(client, headers, account_id)
    assert resp.json()["imported_rows"] == 0
    assert resp.json()["duplicate_rows"] == 4
    assert len(client.get("/transactions", headers=headers).json()) == 4


def test_same_file_to_other_account_imports_separately(client):
    headers = signup(client)
    first = create_account(client, headers)
    resp = client.post("/accounts", json={"name": "Card", "account_type": "credit_card"}, headers=headers)
    second = resp.json()["id"]
    upload(client, headers, first)
    resp = upload(client, headers, second)
    assert resp.json()["imported_rows"] == 4  # dedup is scoped per account


def test_upload_to_foreign_account_404(client):
    alice = signup(client, "alice@example.com")
    account_id = create_account(client, alice)
    mallory = signup(client, "mallory@example.com")
    assert upload(client, mallory, account_id).status_code == 404


def test_upload_unparseable_file_400(client):
    headers = signup(client)
    account_id = create_account(client, headers)
    resp = upload(client, headers, account_id, content=b"foo,bar\n1,2\n")
    assert resp.status_code == 400


def test_list_import_batches(client):
    headers = signup(client)
    account_id = create_account(client, headers)
    upload(client, headers, account_id)
    upload(client, headers, account_id)  # all duplicates
    batches = client.get("/uploads", headers=headers).json()
    assert len(batches) == 2
    assert {b["imported_rows"] for b in batches} == {4, 0}
    assert {b["duplicate_rows"] for b in batches} == {0, 4}


def test_transactions_filter_by_account(client):
    headers = signup(client)
    first = create_account(client, headers)
    upload(client, headers, first)
    resp = client.get(f"/transactions?account_id={first}", headers=headers)
    assert len(resp.json()) == 4
