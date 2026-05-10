# PDF Reader Agent - NVIDIA AI Powered

An intelligent PDF reader that uses NVIDIA's AI models to answer questions about PDF documents.

## Features

- 📄 **PDF Text Extraction**: Automatically reads and extracts text from PDF files
- 🤖 **AI-Powered Q&A**: Uses NVIDIA's Llama model for accurate answers
- 💬 **Interactive Chat**: Ask multiple questions about the document
- 📋 **Document Summary**: Get automatic summaries of PDF content
- 🎯 **Context-Aware**: Answers based only on document content

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Setup**:
   - Make sure `.env` file contains your NVIDIA API key
   - The `Trip_Email.pdf` should be in the same folder

3. **Run the Agent**:
   ```bash
   python pdf_agent.py
   ```

## Usage

### Interactive Mode
```bash
python pdf_agent.py
```
- Automatically loads `Trip_Email.pdf`
- Shows document summary
- Enter questions to get AI-powered answers
- Type 'quit' to exit

### Quick Test
```bash
python test_agent.py
```
- Runs automated tests with sample questions

### Programmatic Usage
```python
from pdf_agent import PDFReaderAgent

# Initialize agent
agent = PDFReaderAgent()

# Load PDF
agent.load_pdf("Trip_Email.pdf")

# Ask questions
answer = agent.ask_question("What is this document about?")
print(answer)

# Get summary
summary = agent.get_document_summary()
print(summary)
```

## Example Questions

Try asking questions like:
- "What is this document about?"
- "Are there any dates mentioned?"
- "Who are the people involved?"
- "What locations are mentioned?"
- "What are the main points?"
- "Is there any contact information?"

## Model Information

- **Model**: `meta/llama-3.1-70b-instruct`
- **Provider**: NVIDIA AI Endpoints
- **Optimized for**: High accuracy document Q&A
- **Temperature**: 0.2 (factual responses)

## Files

- `pdf_agent.py` - Main PDF reader agent
- `test_agent.py` - Quick testing script
- `requirements.txt` - Python dependencies
- `.env` - NVIDIA API key (keep secure)
- `Trip_Email.pdf` - Your PDF document

## Troubleshooting

**PDF not found**: Make sure `Trip_Email.pdf` is in the same folder
**API errors**: Check your NVIDIA API key in `.env` file
**Import errors**: Run `pip install -r requirements.txt`

## Features

✅ Automatic PDF loading
✅ AI-powered question answering  
✅ Document summarization
✅ Interactive chat interface
✅ Error handling and validation
✅ Context-aware responses