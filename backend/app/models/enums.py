import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class AccountType(str, enum.Enum):
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT_CARD = "credit_card"
    CASH = "cash"


class ImportStatus(str, enum.Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class CategorizationSource(str, enum.Enum):
    RULE = "rule"
    LLM = "llm"
    MANUAL = "manual"
    UNCATEGORIZED = "uncategorized"


class CategorizationMethod(str, enum.Enum):
    RULE = "rule"
    LLM = "llm"


class NLQueryStatus(str, enum.Enum):
    EXECUTED = "executed"
    REJECTED = "rejected"
    FAILED = "failed"
