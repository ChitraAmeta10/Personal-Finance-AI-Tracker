"""Rule-based keyword classifier.

Zero-cost, zero-latency first pass. Every rule carries its own confidence:
merchant-specific names score high (they're unambiguous), generic terms score
below the LLM threshold on purpose so ambiguous transactions fall through to
the LLM. The highest-confidence match wins.
"""

from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class RulePrediction:
    category: str | None
    confidence: float
    matched_keyword: str | None


NO_MATCH = RulePrediction(category=None, confidence=0.0, matched_keyword=None)

# (keyword substring, category, confidence)
RULES: list[tuple[str, str, float]] = [
    # groceries — specific chains
    ("trader joe", "groceries", 0.95),
    ("whole foods", "groceries", 0.95),
    ("safeway", "groceries", 0.95),
    ("kroger", "groceries", 0.95),
    ("aldi", "groceries", 0.9),
    ("wegmans", "groceries", 0.95),
    ("publix", "groceries", 0.95),
    ("grocery", "groceries", 0.85),
    ("supermarket", "groceries", 0.85),
    # dining
    ("starbucks", "dining", 0.95),
    ("mcdonald", "dining", 0.95),
    ("chipotle", "dining", 0.95),
    ("uber eats", "dining", 0.95),
    ("ubereats", "dining", 0.95),
    ("doordash", "dining", 0.95),
    ("grubhub", "dining", 0.95),
    ("restaurant", "dining", 0.85),
    ("coffee", "dining", 0.8),
    ("cafe", "dining", 0.75),
    ("pizza", "dining", 0.8),
    # rent
    ("rent", "rent", 0.75),
    ("property management", "rent", 0.85),
    ("landlord", "rent", 0.85),
    # utilities
    ("pg&e", "utilities", 0.95),
    ("con edison", "utilities", 0.95),
    ("comcast", "utilities", 0.9),
    ("xfinity", "utilities", 0.9),
    ("verizon", "utilities", 0.85),
    ("t-mobile", "utilities", 0.85),
    ("at&t", "utilities", 0.85),
    ("electric", "utilities", 0.75),
    ("utility", "utilities", 0.8),
    ("internet", "utilities", 0.7),
    # subscriptions
    ("netflix", "subscriptions", 0.95),
    ("spotify", "subscriptions", 0.95),
    ("hulu", "subscriptions", 0.95),
    ("disney+", "subscriptions", 0.95),
    ("youtube premium", "subscriptions", 0.95),
    ("apple.com/bill", "subscriptions", 0.85),
    ("patreon", "subscriptions", 0.9),
    ("substack", "subscriptions", 0.9),
    ("subscription", "subscriptions", 0.8),
    # transportation
    ("uber", "transportation", 0.85),  # outscored by 'uber eats' when both match
    ("lyft", "transportation", 0.95),
    ("shell", "transportation", 0.8),
    ("chevron", "transportation", 0.9),
    ("exxon", "transportation", 0.9),
    ("parking", "transportation", 0.85),
    ("transit", "transportation", 0.8),
    ("fuel", "transportation", 0.75),
    # entertainment
    ("cinema", "entertainment", 0.9),
    ("amc theatres", "entertainment", 0.95),
    ("ticketmaster", "entertainment", 0.9),
    ("steam games", "entertainment", 0.9),
    ("nintendo", "entertainment", 0.9),
    ("playstation", "entertainment", 0.9),
    # shopping
    ("amazon", "shopping", 0.75),  # deliberately low: could be groceries, subs, ...
    ("amzn", "shopping", 0.75),
    ("target", "shopping", 0.8),
    ("walmart", "shopping", 0.75),
    ("best buy", "shopping", 0.9),
    ("etsy", "shopping", 0.9),
    ("ebay", "shopping", 0.85),
    # health
    ("cvs", "health", 0.85),
    ("walgreens", "health", 0.85),
    ("pharmacy", "health", 0.9),
    ("dental", "health", 0.9),
    ("clinic", "health", 0.85),
    ("gym", "health", 0.85),
    ("fitness", "health", 0.8),
    # travel
    ("airbnb", "travel", 0.95),
    ("airline", "travel", 0.9),
    ("delta air", "travel", 0.95),
    ("united air", "travel", 0.95),
    ("marriott", "travel", 0.95),
    ("hilton", "travel", 0.95),
    ("hotel", "travel", 0.85),
    ("expedia", "travel", 0.9),
    ("booking.com", "travel", 0.9),
    # income (sign-gated below)
    ("payroll", "income", 0.95),
    ("paycheck", "income", 0.95),
    ("direct deposit", "income", 0.85),
    ("salary", "income", 0.9),
    # transfers — inherently ambiguous, kept below threshold to route to LLM
    ("zelle", "transfers", 0.65),
    ("venmo", "transfers", 0.6),
    ("paypal", "transfers", 0.5),
    ("wire transfer", "transfers", 0.8),
    ("transfer", "transfers", 0.65),
    # fees
    ("overdraft", "fees", 0.95),
    ("atm fee", "fees", 0.95),
    ("service fee", "fees", 0.9),
    ("interest charge", "fees", 0.9),
    ("annual fee", "fees", 0.9),
]


def classify_rule(
    merchant_raw: str,
    merchant_normalized: str | None,
    description: str | None,
    amount: Decimal | None,
) -> RulePrediction:
    text = " ".join(filter(None, (merchant_raw, merchant_normalized, description))).lower()
    best = NO_MATCH
    for keyword, category, confidence in RULES:
        if keyword not in text:
            continue
        # Income keywords on money-out rows are almost certainly not income.
        if category == "income" and amount is not None and amount <= 0:
            confidence *= 0.3
        if confidence > best.confidence:
            best = RulePrediction(category=category, confidence=confidence, matched_keyword=keyword)
    return best
