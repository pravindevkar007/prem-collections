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
        self.model = "meta/llama-3.1-70b-instruct"
        self.pdf_content = ""
        self.pdf_name = ""
        
    def load_pdf(self, pdf_path):
        """Load and extract text from PDF"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
                
                self.pdf_content = text
                self.pdf_name = os.path.basename(pdf_path)
                
                return f"Successfully loaded {self.pdf_name} ({len(pdf_reader.pages)} pages)"
                
        except Exception as e:
            return f"Error reading PDF: {str(e)}"
    
    def ask_question(self, question):
        """Ask a question about the loaded PDF"""
        if not self.pdf_content:
            return "No PDF loaded. Please load a PDF first."
        
        prompt = f"""You are an AI assistant that answers questions based on a PDF document.

DOCUMENT: {self.pdf_name}
CONTENT:
{self.pdf_content[:6000]}

USER QUESTION: {question}

INSTRUCTIONS:
- Answer based ONLY on the document content
- Be specific and accurate
- If information is not available, state clearly
- Keep answers clear and concise

ANSWER:"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 600,
            "temperature": 0.2,
            "top_p": 0.9
        }

        try:
            response = requests.post(self.invoke_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            answer = result['choices'][0]['message']['content'].strip()
            
            return answer
            
        except Exception as e:
            return f"Error: {str(e)}"

    def get_document_summary(self):
        """Get a summary of the loaded document"""
        if not self.pdf_content:
            return "No PDF loaded."
        
        summary_prompt = f"""Provide a brief summary of this document:

DOCUMENT: {self.pdf_name}
CONTENT:
{self.pdf_content[:4000]}

Create a concise summary covering:
- Document type and purpose
- Main topics covered
- Key information highlights

Keep it under 150 words."""

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