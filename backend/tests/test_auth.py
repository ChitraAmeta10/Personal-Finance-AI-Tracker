from app.core.security import hash_password
from app.models import User, UserRole

EMAIL = "alice@example.com"
PASSWORD = "s3cret-pass"


def register(client, email=EMAIL, password=PASSWORD):
    return client.post("/auth/register", json={"email": email, "password": password})


def login(client, email=EMAIL, password=PASSWORD):
    return client.post("/auth/login", data={"username": email, "password": password})


def auth_header(client) -> dict:
    register(client)
    token = login(client).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_returns_user_without_password(client):
    resp = register(client)
    assert resp.status_code == 201
    body = resp.json()
    assert body["email"] == EMAIL
    assert body["role"] == "user"
    assert "password" not in body and "hashed_password" not in body


def test_register_duplicate_email_conflicts(client):
    assert register(client).status_code == 201
    assert register(client).status_code == 409


def test_register_rejects_short_password(client):
    resp = register(client, password="short")
    assert resp.status_code == 422


def test_login_returns_bearer_token(client):
    register(client)
    resp = login(client)
    assert resp.status_code == 200
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_wrong_password_401(client):
    register(client)
    assert login(client, password="wrong-password").status_code == 401


def test_login_unknown_email_401(client):
    assert login(client, email="nobody@example.com").status_code == 401


def test_me_returns_current_user(client):
    headers = auth_header(client)
    resp = client.get("/auth/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == EMAIL


def test_me_without_token_401(client):
    assert client.get("/auth/me").status_code == 401


def test_me_with_garbage_token_401(client):
    resp = client.get("/auth/me", headers={"Authorization": "Bearer not-a-jwt"})
    assert resp.status_code == 401


def test_admin_route_forbidden_for_regular_user(client):
    headers = auth_header(client)
    assert client.get("/auth/users", headers=headers).status_code == 403


def test_admin_route_allowed_for_admin(client, db):
    db.add(User(email="admin@example.com", hashed_password=hash_password(PASSWORD), role=UserRole.ADMIN))
    db.commit()
    token = login(client, email="admin@example.com").json()["access_token"]
    resp = client.get("/auth/users", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert [u["email"] for u in resp.json()] == ["admin@example.com"]
