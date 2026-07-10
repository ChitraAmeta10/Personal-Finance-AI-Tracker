"""CSV statement parsing.

Banks disagree on everything: column names, date formats, whether spending is
negative or positive, single amount column vs debit/credit pair. This module
normalizes all of it to one canonical shape:

    amount is signed, negative = money out.
"""

import csv
import io
import re
from string import capwords
from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal, InvalidOperation


class CSVParseError(ValueError):
    """The file as a whole is unusable (bad encoding, no recognizable columns)."""


@dataclass(frozen=True)
class ParsedRow:
    txn_date: date
    merchant_raw: str
    description: str | None
    amount: Decimal  # signed, negative = money out


# Header candidates, matched case-insensitively after stripping whitespace.
DATE_COLUMNS = ("date", "transaction date", "posted date", "posting date")
DESCRIPTION_COLUMNS = ("description", "details", "memo", "transaction description")
MERCHANT_COLUMNS = ("merchant", "payee", "name")
AMOUNT_COLUMNS = ("amount", "transaction amount")
DEBIT_COLUMNS = ("debit", "withdrawal", "withdrawals", "money out")
CREDIT_COLUMNS = ("credit", "deposit", "deposits", "money in")

DATE_FORMATS = ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y", "%Y/%m/%d", "%d %b %Y", "%b %d, %Y")

_AMOUNT_JUNK = re.compile(r"[$,\s]")


def parse_amount(raw: str) -> Decimal | None:
    """'$1,234.56' -> 1234.56; '(45.00)' -> -45.00; '' -> None."""
    cleaned = _AMOUNT_JUNK.sub("", raw)
    if not cleaned:
        return None
    negative = cleaned.startswith("(") and cleaned.endswith(")")
    if negative:
        cleaned = cleaned[1:-1]
    try:
        value = Decimal(cleaned).quantize(Decimal("0.01"))
    except InvalidOperation:
        raise ValueError(f"unparseable amount: {raw!r}")
    return -value if negative else value


def parse_date(raw: str) -> date:
    cleaned = raw.strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(cleaned, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"unparseable date: {raw!r}")


def normalize_merchant(raw: str) -> str:
    """'TRADER JOE'S #123' -> 'Trader Joe's'; 'AMZN Mktp US*2K4XY1' -> 'AMZN Mktp US'."""
    s = raw.strip()
    s = re.sub(r"\s*#\d+", "", s)          # store numbers
    s = re.sub(r"\*[\w.-]+\s*$", "", s)    # payment-processor suffixes
    s = re.sub(r"\s{2,}", " ", s).strip(" -*")
    if not s:
        return raw.strip()
    # capwords (not str.title) so apostrophes survive: TRADER JOE'S -> Trader Joe's
    return capwords(s.lower()) if s.isupper() else s


def _find_column(header: list[str], candidates: tuple[str, ...]) -> str | None:
    normalized = {h.strip().lower(): h for h in header}
    for candidate in candidates:
        if candidate in normalized:
            return normalized[candidate]
    return None


def parse_csv(content: bytes, invert_amounts: bool = False) -> tuple[list[ParsedRow], int, list[str]]:
    """Parse a statement CSV.

    Returns (rows, total_data_rows, row_errors). Individual bad rows are
    skipped and reported in row_errors; a structurally unusable file raises
    CSVParseError.
    """
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise CSVParseError("file is not valid UTF-8")

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise CSVParseError("file is empty")

    header = list(reader.fieldnames)
    date_col = _find_column(header, DATE_COLUMNS)
    desc_col = _find_column(header, DESCRIPTION_COLUMNS)
    merchant_col = _find_column(header, MERCHANT_COLUMNS)
    amount_col = _find_column(header, AMOUNT_COLUMNS)
    debit_col = _find_column(header, DEBIT_COLUMNS)
    credit_col = _find_column(header, CREDIT_COLUMNS)

    if date_col is None:
        raise CSVParseError(f"no date column found (looked for {', '.join(DATE_COLUMNS)})")
    if amount_col is None and debit_col is None and credit_col is None:
        raise CSVParseError("no amount column found (looked for amount, or debit/credit pair)")
    if merchant_col is None and desc_col is None:
        raise CSVParseError("no merchant or description column found")

    rows: list[ParsedRow] = []
    errors: list[str] = []
    total = 0
    for line_no, record in enumerate(reader, start=2):
        if not any((value or "").strip() for value in record.values()):
            continue  # blank line
        total += 1
        try:
            if amount_col is not None:
                amount = parse_amount(record[amount_col] or "")
                if amount is None:
                    raise ValueError("missing amount")
                if invert_amounts:
                    amount = -amount
            else:
                debit = parse_amount(record.get(debit_col) or "") if debit_col else None
                credit = parse_amount(record.get(credit_col) or "") if credit_col else None
                if debit is None and credit is None:
                    raise ValueError("missing amount")
                amount = (credit or Decimal("0")) - (debit or Decimal("0"))

            merchant = (record.get(merchant_col) or "").strip() if merchant_col else ""
            description = (record.get(desc_col) or "").strip() if desc_col else ""
            if not merchant:
                merchant = description
            if not merchant:
                raise ValueError("missing merchant/description")

            rows.append(
                ParsedRow(
                    txn_date=parse_date(record[date_col] or ""),
                    merchant_raw=merchant[:255],
                    description=description or None,
                    amount=amount,
                )
            )
        except ValueError as exc:
            errors.append(f"line {line_no}: {exc}")

    return rows, total, errors
