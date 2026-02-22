from langchain_community.vectorstores import Chroma
from .embedding_service import get_embedding_function

PERSIST_DIRECTORY = "chroma_db"

def get_vector_store():
    embedding = get_embedding_function()
    
    vectorstore = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embedding
    )
    
    return vectorstore