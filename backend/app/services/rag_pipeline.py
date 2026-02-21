from .vector_store import get_vector_store
from ..llm import ask_llm

def run_rag(query: str):
    vectorstore = get_vector_store()

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