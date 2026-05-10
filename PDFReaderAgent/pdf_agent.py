import os
import requests
from dotenv import load_dotenv
import PyPDF2

class PDFReaderAgent:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        self.api_key = os.getenv('NVIDIA_API_KEY')
        self.invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "meta/llama-3.1-70b-instruct"  # High accuracy for PDF Q&A
        self.pdf_content = ""
        self.pdf_name = ""
        
    def load_pdf(self, pdf_path="Trip_Email.pdf"):
        """Load and extract text from PDF"""
        try:
            # Use absolute path
            if not os.path.isabs(pdf_path):
                pdf_path = os.path.join(os.path.dirname(__file__), pdf_path)
            
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                print(f"Reading PDF: {os.path.basename(pdf_path)}")
                print(f"Total pages: {len(pdf_reader.pages)}")
                
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
                
                self.pdf_content = text
                self.pdf_name = os.path.basename(pdf_path)
                
                return f"Successfully loaded {self.pdf_name} ({len(pdf_reader.pages)} pages, {len(text)} characters)"
                
        except FileNotFoundError:
            return f"PDF file not found: {pdf_path}"
        except Exception as e:
            return f"Error reading PDF: {str(e)}"
    
    def ask_question(self, question):
        """Ask a question about the loaded PDF"""
        if not self.pdf_content:
            return "No PDF loaded. Please load a PDF first using load_pdf()."
        
        # Create a focused prompt for PDF Q&A
        prompt = f"""You are an AI assistant that answers questions based on a PDF document.

DOCUMENT: {self.pdf_name}
CONTENT:
{self.pdf_content[:6000]}  # Limit to avoid token limits

USER QUESTION: {question}

INSTRUCTIONS:
- Answer the question based ONLY on the information in the document above
- Be specific and accurate
- If the information is not in the document, clearly state "This information is not available in the provided document"
- Quote relevant parts when helpful
- Keep your answer clear and concise
- If it's about dates, locations, or specific details, be precise

ANSWER:"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 600,
            "temperature": 0.2,  # Low temperature for factual accuracy
            "top_p": 0.9,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0
        }

        try:
            print("Analyzing document...")
            response = requests.post(self.invoke_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            answer = result['choices'][0]['message']['content'].strip()
            
            return f"Answer: {answer}"
            
        except requests.exceptions.RequestException as e:
            return f"API Error: {str(e)}"
        except KeyError as e:
            return f"Unexpected response format: {str(e)}"

    def get_document_summary(self):
        """Get a summary of the loaded document"""
        if not self.pdf_content:
            return "No PDF loaded."
        
        summary_prompt = f"""Provide a brief summary of this document:

DOCUMENT: {self.pdf_name}
CONTENT:
{self.pdf_content[:4000]}

Create a concise summary covering:
- What type of document this is
- Main topics or subjects covered
- Key information or highlights
- Document structure (if relevant)

Keep it under 200 words."""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": summary_prompt}],
            "max_tokens": 300,
            "temperature": 0.3
        }

        try:
            response = requests.post(self.invoke_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
            
        except Exception as e:
            return f"Error generating summary: {str(e)}"

def main():
    """Interactive PDF Q&A session"""
    agent = PDFReaderAgent()
    
    print("PDF Reader Agent - NVIDIA AI Powered")
    print("=" * 50)
    
    # Auto-load the Trip_Email.pdf
    result = agent.load_pdf("Trip_Email.pdf")
    print(result)
    
    if "Successfully loaded" not in result:
        print("Failed to load PDF. Exiting...")
        return
    
    # Show document summary
    print("\nDocument Summary:")
    print("-" * 30)
    summary = agent.get_document_summary()
    print(summary)
    
    print("\n" + "=" * 50)
    print("Ask me anything about the document!")
    print("Commands: 'summary' for document overview, 'quit' to exit")
    print("=" * 50)
    
    while True:
        question = input("\nYour question: ").strip()
        
        if question.lower() in ['quit', 'exit', 'q']:
            print("Goodbye!")
            break
        
        if question.lower() == 'summary':
            print("\nDocument Summary:")
            print(agent.get_document_summary())
            continue
            
        if not question:
            continue
        
        # Get answer from AI
        answer = agent.ask_question(question)
        print(f"\n{answer}")
        print("-" * 50)

if __name__ == "__main__":
    main()