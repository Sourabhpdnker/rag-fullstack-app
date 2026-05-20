# backend/app/services/rag_pipeline.py

from .vectorstore import get_vector_store
from ..llm import ask_llm

def handle_special_commands(query: str, context: str) -> str | None:
    """
    Handle special user requests like creating questions, summaries, etc.
    """
    query_lower = query.lower()
    
    # Create questions from content
    if "create questions" in query_lower or "generate questions" in query_lower or "make questions" in query_lower:
        return f"""Based on the document, here are relevant questions:

1. What are the key points discussed in the document?
2. What are the main conclusions or recommendations?
3. Can you provide specific examples from the text?
4. What problems are identified and what solutions are proposed?
5. How would you summarize the most important information?

To get specific answers, please ask me about particular sections or concepts from the document."""
    
    # Summarize request
    elif "summarize" in query_lower or "summary" in query_lower:
        return """I'll help summarize the document. Please ask me specific questions about:
- Main topics and key themes
- Important findings or conclusions
- Critical details or examples
- Any particular section you're interested in

What specific aspect would you like me to focus on? For example:
- "Give me a brief summary"
- "What are the main points?"
- "Summarize the conclusion section"
- "List the key takeaways"
"""
    
    # Explain request
    elif "explain" in query_lower:
        return "I'll explain concepts from the document. Could you please specify which term or concept you'd like me to explain? For example: 'Explain the main concept' or 'What does [specific term] mean?'"
    
    return None  # No special command detected

def run_rag(query: str) -> str:
    """
    Enhanced RAG pipeline with better prompting
    """
    try:
        # Get relevant documents from vector store
        vectorstore = get_vector_store()
        results = vectorstore.similarity_search(query, k=4)
        
        if not results:
            return "I couldn't find any relevant information in the uploaded documents. Please make sure you've uploaded a PDF file."
        
        # Extract document content
        context = "\n\n".join([doc.page_content for doc in results])
        
        # Check for special commands first
        special_response = handle_special_commands(query, context)
        if special_response:
            return special_response
        
        # Enhanced prompt with better instructions
        prompt = f"""You are an intelligent PDF assistant. Answer the user's question based ONLY on the provided document context.

CONTEXT FROM DOCUMENTS:
{context}

USER QUESTION: {query}

INSTRUCTIONS:
1. Answer based ONLY on the context above
2. If the context doesn't contain the answer, say "I cannot find this information in the uploaded documents"
3. Be specific, detailed, and use examples from the text
4. Format your response clearly with bullet points or numbered lists when appropriate
5. Keep the response helpful and actionable
6. Do not make up information not in the context

YOUR RESPONSE:"""
        
        # Get response from Ollama
        response = ask_llm(prompt)
        
        # Fallback if response is empty
        if not response or len(response.strip()) < 10:
            return "I'm having trouble generating a response. Please try rephrasing your question."
        
        return response
        
    except Exception as e:
        print(f"RAG Error: {e}")
        return f"An error occurred while processing your request. Please check if Ollama is running and a PDF is uploaded."