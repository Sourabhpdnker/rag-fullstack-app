# backend/app/llm.py

import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"  # or "mistral", "phi", etc.

def ask_llm(prompt: str) -> str:
    """
    Enhanced LLM call with better parameters
    """
    try:
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,      # Creative but focused (0.7 is sweet spot)
                "top_p": 0.9,            # Nucleus sampling
                "top_k": 40,             # Limit token choices
                "num_predict": 500,      # Max response length
                "repeat_penalty": 1.1,   # Avoid repetition
                "stop": ["Human:", "User:", "Question:"]
            }
        }
        
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            print(f"Ollama error: {response.status_code}")
            return "I'm having trouble connecting to the AI model. Please check if Ollama is running."
            
    except requests.exceptions.Timeout:
        return "The AI took too long to respond. Please try again with a simpler question."
    except Exception as e:
        print(f"LLM Error: {e}")
        return "An error occurred while generating the response."


# Alternative: Add a simpler function for quick responses
def ask_llm_simple(prompt: str) -> str:
    """
    Simple LLM call without extra parameters (fallback)
    """
    try:
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }
        
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        return None
        
    except Exception:
        return None