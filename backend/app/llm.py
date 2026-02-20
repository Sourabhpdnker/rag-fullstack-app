import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def ask_llm(prompt: str) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "mistral",  # you already have mistral installed
                "prompt": prompt,
                "stream": False
            }
        )

        response.raise_for_status()
        data = response.json()
        return data.get("response", "")

    except Exception as e:
        return f"Error communicating with Ollama: {str(e)}"