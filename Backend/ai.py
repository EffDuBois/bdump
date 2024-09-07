from cred import headers
import requests

model = "meta-llama/Llama-2-7b"
api_url = f"https://api-inference.huggingface.co/models/{model}"

def generate_embedding(query):
    response = requests.post(api_url, headers=headers, json={"inputs": query})
    if response.status_code == 200:
        embeddings = response.json()
        return embeddings
    else:
        # return f"Error: {response.status_code} - {response.text}"
        return "[0, 6, 9, 0]"

def generate_note(query):
    return f"#your mom  {query}"


