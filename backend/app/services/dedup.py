"""Transaction deduplication.

Bank exports carry no stable transaction IDs, so we fingerprint content:
sha256(date | amount | merchant | description | ordinal). The ordinal is the
occurrence index of an identical row *within one file* — so re-uploading the
same statement is fully idempotent (same ordinals, same hashes), while two
genuinely identical purchases in one statement (ordinals 0 and 1) both
survive. Known limitation: the same purchase appearing in two overlapping
exports is treated as a duplicate — indistinguishable from a re-upload
without bank-side IDs.
"""

import hashlib
from collections import Counter

from app.services.csv_parser import ParsedRow


def _content_key(row: ParsedRow) -> str:
    return f"{row.txn_date.isoformat()}|{row.amount}|{row.merchant_raw}|{row.description or ''}"


def dedup_hash(row: ParsedRow, ordinal: int) -> str:
    return hashlib.sha256(f"{_content_key(row)}|{ordinal}".encode("utf-8")).hexdigest()


def assign_dedup_hashes(rows: list[ParsedRow]) -> list[tuple[ParsedRow, str]]:
    """Hash every row, disambiguating identical rows with an occurrence ordinal."""
    seen: Counter[str] = Counter()
    result = []
    for row in rows:
        key = _content_key(row)
        result.append((row, dedup_hash(row, seen[key])))
        seen[key] += 1
    return result
