import os
from pathlib import Path

import chromadb
from chromadb.config import Settings
import pandas as pd
from sentence_transformers import SentenceTransformer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
COLLECTION_NAME = "supply_chain_shipments"
PERSIST_DIR = Path(__file__).resolve().parent / ".chromadb"


def _find_shipments_csv() -> Path:
    candidate_paths = [
        Path(__file__).resolve().parent / "data" / "shipments.csv",
        Path(__file__).resolve().parent.parent / "data" / "shipments.csv",
    ]
    for path in candidate_paths:
        if path.exists():
            return path

    raise FileNotFoundError(
        "Could not find data/shipments.csv. Expected the CSV in backend/data/shipments.csv or ../data/shipments.csv."
    )


def _load_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME)


def _build_document_text(row: pd.Series) -> str:
    text_fields = []
    for key, value in row.items():
        if pd.notna(value):
            text_fields.append(f"{key}: {value}")
    return " \n".join(text_fields)


def _embedding_function(texts):
    model = _load_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    return [embedding.tolist() for embedding in embeddings]


def _get_client() -> chromadb.Client:
    PERSIST_DIR.mkdir(parents=True, exist_ok=True)
    return chromadb.Client(
        Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=str(PERSIST_DIR),
        )
    )


def _collection_exists(client: chromadb.Client) -> bool:
    try:
        return any(c.name == COLLECTION_NAME for c in client.list_collections())
    except Exception:
        return False


def _collection_has_documents(collection) -> bool:
    try:
        return collection.count() > 0
    except Exception:
        return False


def ingest_shipments(client, collection):
    csv_path = _find_shipments_csv()
    df = pd.read_csv(csv_path)

    if df.empty:
        raise ValueError(f"Expected shipments CSV at {csv_path} to contain rows.")

    documents = []
    ids = []
    metadatas = []
    for idx, row in df.iterrows():
        doc_id = str(row.get("shipment_id", idx))
        ids.append(doc_id)
        documents.append(_build_document_text(row))
        metadatas.append(row.drop(labels=["shipment_id"], errors="ignore").to_dict())

    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
    )
    client.persist()
    return collection


def setup_collection():
    client = _get_client()
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=_embedding_function,
    )

    if not _collection_has_documents(collection):
        ingest_shipments(client, collection)

    return collection


def query_shipments(collection, query_text, top_k=5):
    query_results = collection.query(
        query_texts=[query_text],
        n_results=top_k,
        include=['documents', 'metadatas', 'distances'],
    )

    matches = []
    for doc, metadata, distance in zip(
        query_results["documents"][0],
        query_results["metadatas"][0],
        query_results["distances"][0],
    ):
        matches.append({
            "document": doc,
            "metadata": metadata,
            "distance": distance,
        })
    return matches
