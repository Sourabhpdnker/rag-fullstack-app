from .vectorstore import get_vector_store
from ..llm import ask_llm

def run_rag(query: str):
    vectorstore = get_vector_store()

    # 🔥 Safety check: prevent querying empty DB
    if vectorstore._collection.count() == 0:
        return "No documents uploaded yet. Please upload a PDF first."

    docs = vectorstore.similarity_search(query, k=3)

    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""
Use the context below to answer the question.

Context:
{context}

Question:
{query}
"""

    response = ask_llm(prompt)

    return response