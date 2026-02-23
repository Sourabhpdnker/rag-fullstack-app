import os
from langchain_chroma import Chroma
from .embedding_service import get_embedding_function

PERSIST_DIRECTORY = "chroma_db"
COLLECTION_NAME = "rag_collection"


def get_vector_store():
    """
    Returns a Chroma vector store instance.
    If the persist directory does not exist, it will be created automatically.
    """

    # Ensure directory exists
    if not os.path.exists(PERSIST_DIRECTORY):
        os.makedirs(PERSIST_DIRECTORY)

    embedding = get_embedding_function()

    vectorstore = Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embedding
    )

    return vectorstore