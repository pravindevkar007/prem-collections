# PDF Agent (Python) - Complete Documentation

## Overview
The Python PDF Agent is an AI-powered document reader that extracts text from PDF files and uses NVIDIA's AI models to answer questions about the content.

## Architecture Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PDF File      │───▶│  PyPDF2 Parser   │───▶│  Text Content   │
│ (Trip_Email.pdf)│    │                  │    │   (String)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ User Question   │───▶│  Prompt Builder  │◀───│  PDF Content    │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI Response   │◀───│   NVIDIA API     │◀───│  Formatted      │
│                 │    │ (Llama 3.1 70B)  │    │   Prompt        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Class Structure

### PDFReaderAgent Class

#### **Initialization**
```python
def __init__(self):
    load_dotenv()                                    # Load .env variables
    self.api_key = os.getenv('NVIDIA_API_KEY')      # Get API key
    self.invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    self.model = "meta/llama-3.1-70b-instruct"      # High accuracy model
    self.pdf_content = ""                           # Stores extracted text
    self.pdf_name = ""                              # Stores PDF filename
```

#### **PDF Loading Process**
```python
def load_pdf(self, pdf_path="Trip_Email.pdf"):
```

**Step-by-Step Flow:**

1. **Path Resolution**
   ```python
   if not os.path.isabs(pdf_path):
       pdf_path = os.path.join(os.path.dirname(__file__), pdf_path)
   ```
   - Converts relative paths to absolute paths
   - Ensures file can be found regardless of execution location

2. **File Reading**
   ```python
   with open(pdf_path, 'rb') as file:
       pdf_reader = PyPDF2.PdfReader(file)
   ```
   - Opens PDF in binary read mode
   - Creates PyPDF2 reader object

3. **Text Extraction**
   ```python
   for page_num in range(len(pdf_reader.pages)):
       page = pdf_reader.pages[page_num]
       page_text = page.extract_text()
       text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
   ```
   - Iterates through each page
   - Extracts text from each page
   - Adds page markers for context

4. **Content Storage**
   ```python
   self.pdf_content = text
   self.pdf_name = os.path.basename(pdf_path)
   ```
   - Stores extracted text in instance variable
   - Saves filename for reference

#### **Question Answering Process**
```python
def ask_question(self, question):
```

**Step-by-Step Flow:**

1. **Content Validation**
   ```python
   if not self.pdf_content:
       return "No PDF loaded. Please load a PDF first using load_pdf()."
   ```

2. **Prompt Construction**
   ```python
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
   ```

3. **API Request Setup**
   ```python
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
   ```

4. **API Call & Response Processing**
   ```python
   response = requests.post(self.invoke_url, headers=headers, json=payload)
   response.raise_for_status()
   
   result = response.json()
   answer = result['choices'][0]['message']['content'].strip()
   ```

## Main Function Flow

### Interactive Session
```python
def main():
```

**Execution Steps:**

1. **Agent Initialization**
   ```python
   agent = PDFReaderAgent()
   ```

2. **Auto PDF Loading**
   ```python
   result = agent.load_pdf("Trip_Email.pdf")
   ```

3. **Document Summary Generation**
   ```python
   summary = agent.get_document_summary()
   ```

4. **Interactive Loop**
   ```python
   while True:
       question = input("\nYour question: ").strip()
       
       if question.lower() in ['quit', 'exit', 'q']:
           break
       
       answer = agent.ask_question(question)
       print(f"\n{answer}")
   ```

## Configuration Parameters

### Model Settings
- **Model**: `meta/llama-3.1-70b-instruct`
- **Temperature**: `0.2` (Low for factual accuracy)
- **Max Tokens**: `600` (Sufficient for detailed answers)
- **Top P**: `0.9` (Balanced creativity)

### Content Limits
- **PDF Content**: First 6000 characters sent to AI
- **Summary Content**: First 4000 characters for summaries
- **Reason**: Token limits and cost optimization

## Error Handling

### File Operations
```python
try:
    with open(pdf_path, 'rb') as file:
        # PDF processing
except FileNotFoundError:
    return f"PDF file not found: {pdf_path}"
except Exception as e:
    return f"Error reading PDF: {str(e)}"
```

### API Operations
```python
try:
    response = requests.post(self.invoke_url, headers=headers, json=payload)
    response.raise_for_status()
except requests.exceptions.RequestException as e:
    return f"API Error: {str(e)}"
except KeyError as e:
    return f"Unexpected response format: {str(e)}"
```

## Dependencies

### Required Packages
```python
import os              # File path operations
import requests        # HTTP requests to NVIDIA API
from dotenv import load_dotenv  # Environment variable loading
import PyPDF2          # PDF text extraction
```

### Installation
```bash
pip install PyPDF2==3.0.1 requests==2.31.0 python-dotenv==1.0.0
```

## Usage Examples

### Basic Usage
```python
from pdf_agent import PDFReaderAgent

agent = PDFReaderAgent()
agent.load_pdf("Trip_Email.pdf")
answer = agent.ask_question("Who is travelling from where to where?")
print(answer)
```

### Interactive Session
```bash
python pdf_agent.py
```

### Programmatic Usage
```python
agent = PDFReaderAgent()
result = agent.load_pdf("document.pdf")

if "Successfully loaded" in result:
    summary = agent.get_document_summary()
    answer = agent.ask_question("What is the main topic?")
```

## Performance Considerations

### Optimization Features
- **Content Truncation**: Limits text sent to API (6000 chars)
- **Low Temperature**: Reduces hallucination (0.2)
- **Efficient Parsing**: Page-by-page extraction
- **Error Recovery**: Graceful error handling

### Limitations
- **Large PDFs**: Only first 6000 characters processed
- **Complex Layouts**: May miss formatted content
- **Images/Tables**: Text-only extraction
- **API Costs**: Per-request pricing

## Security Features

### Environment Variables
```python
load_dotenv()  # Loads from .env file
self.api_key = os.getenv('NVIDIA_API_KEY')
```

### Input Validation
- File existence checks
- Content validation before API calls
- Error message sanitization

## Troubleshooting

### Common Issues
1. **"PDF file not found"**: Check file path and existence
2. **"API Error"**: Verify NVIDIA_API_KEY in .env file
3. **"No PDF loaded"**: Call load_pdf() before ask_question()
4. **Encoding errors**: Ensure UTF-8 compatible content

### Debug Steps
1. Check .env file exists and contains API key
2. Verify PDF file is in correct location
3. Test with simple questions first
4. Check internet connection for API calls