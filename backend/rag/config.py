from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent

PROJECT_ROOT = BACKEND_DIR.parent

KNOWLEDGE_DIR = PROJECT_ROOT / "knowledge"

ORG_NAME = "sample_company"

DOCUMENT_DIR = (
    KNOWLEDGE_DIR
    / "organizations"
    / ORG_NAME
    / "documents"
)

VECTOR_DIR = (
    KNOWLEDGE_DIR
    / "organizations"
    / ORG_NAME
    / "vectordb"
)

METADATA_DIR = (
    KNOWLEDGE_DIR
    / "organizations"
    / ORG_NAME
    / "metadata"
)