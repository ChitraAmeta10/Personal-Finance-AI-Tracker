from datetime import date
from decimal import Decimal

import pytest

from app.services.csv_parser import (
    CSVParseError,
    normalize_merchant,
    parse_amount,
    parse_csv,
    parse_date,
)
from app.services.dedup import assign_dedup_hashes


def test_parse_standard_format():
    content = (
        b"Date,Description,Amount\n"
        b"2026-07-01,TRADER JOE'S #123,-54.23\n"
        b"2026-07-02,PAYCHECK,2500.00\n"
    )
    rows, total, errors = parse_csv(content)
    assert total == 2 and not errors
    assert rows[0].txn_date == date(2026, 7, 1)
    assert rows[0].amount == Decimal("-54.23")
    assert rows[1].amount == Decimal("2500.00")


def test_parse_debit_credit_format():
    content = (
        b"Posted Date,Payee,Debit,Credit\n"
        b"07/01/2026,NETFLIX.COM,15.49,\n"
        b"07/03/2026,EMPLOYER INC,,2500.00\n"
    )
    rows, total, errors = parse_csv(content)
    assert not errors
    assert rows[0].amount == Decimal("-15.49")  # debit becomes negative
    assert rows[1].amount == Decimal("2500.00")


def test_parse_currency_symbols_and_parentheses():
    assert parse_amount("$1,234.56") == Decimal("1234.56")
    assert parse_amount("(45.00)") == Decimal("-45.00")
    assert parse_amount("") is None


def test_parse_date_formats():
    for raw in ("2026-07-01", "07/01/2026", "07/01/26", "2026/07/01", "01 Jul 2026", "Jul 1, 2026"):
        assert parse_date(raw) == date(2026, 7, 1)
    with pytest.raises(ValueError):
        parse_date("not a date")


def test_invert_amounts_flag():
    content = b"Date,Description,Amount\n2026-07-01,STARBUCKS,4.50\n"
    rows, _, _ = parse_csv(content, invert_amounts=True)
    assert rows[0].amount == Decimal("-4.50")


def test_bad_rows_skipped_and_reported():
    content = (
        b"Date,Description,Amount\n"
        b"2026-07-01,GOOD ROW,-10.00\n"
        b"garbage-date,BAD ROW,-5.00\n"
        b"2026-07-02,NO AMOUNT,\n"
    )
    rows, total, errors = parse_csv(content)
    assert total == 3
    assert len(rows) == 1
    assert len(errors) == 2


def test_unrecognizable_header_raises():
    with pytest.raises(CSVParseError):
        parse_csv(b"foo,bar,baz\n1,2,3\n")


def test_merchant_falls_back_to_description():
    content = b"Date,Description,Amount\n2026-07-01,SHELL OIL 5551212,-40.00\n"
    rows, _, _ = parse_csv(content)
    assert rows[0].merchant_raw == "SHELL OIL 5551212"


def test_normalize_merchant():
    assert normalize_merchant("TRADER JOE'S #123") == "Trader Joe's"
    assert normalize_merchant("AMZN Mktp US*2K4XY1") == "AMZN Mktp US"
    assert normalize_merchant("Netflix.com") == "Netflix.com"


def test_dedup_identical_rows_get_distinct_hashes():
    content = (
        b"Date,Description,Amount\n"
        b"2026-07-01,STARBUCKS,-4.50\n"
        b"2026-07-01,STARBUCKS,-4.50\n"
    )
    rows, _, _ = parse_csv(content)
    hashed = assign_dedup_hashes(rows)
    assert hashed[0][1] != hashed[1][1]


def test_dedup_hashes_stable_across_reparse():
    content = b"Date,Description,Amount\n2026-07-01,STARBUCKS,-4.50\n2026-07-01,STARBUCKS,-4.50\n"
    first = [h for _, h in assign_dedup_hashes(parse_csv(content)[0])]
    second = [h for _, h in assign_dedup_hashes(parse_csv(content)[0])]
    assert first == second
