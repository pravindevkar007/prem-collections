import os
from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import ChatNVIDIA

load_dotenv()

def test_nvidia_api():
    print("Testing NVIDIA API...")
    
    # Try different models
    models_to_try = [
        "ai-llama-3_1-8b-instruct",
        "ai-llama-3_1-70b-instruct", 
        "ai-mixtral-8x7b-instruct",
        "ai-gemma-2-2b-it"
    ]
    
    for model in models_to_try:
        try:
            print(f"\nTrying model: {model}")
            llm = ChatNVIDIA(
                model=model,
                api_key=os.getenv('NVIDIA_API_KEY'),
                temperature=0.7
            )
            
            response = llm.invoke("Hello! What's today's date?")
            print(f"SUCCESS with {model}!")
            print(f"Response: {response.content}")
            return model  # Return the working model
            
        except Exception as e:
            print(f"Failed with {model}: {e}")
    
    print("No models worked!")
    return None

if __name__ == "__main__":
    working_model = test_nvidia_api()
    if working_model:
        print(f"\nUse this model in your agent: {working_model}")