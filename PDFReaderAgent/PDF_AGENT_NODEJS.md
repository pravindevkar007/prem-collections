# PDF Agent (Node.js) - Complete Documentation

## Overview
The Node.js PDF Agent is an AI-powered document reader that extracts text from PDF files and uses NVIDIA's AI models to answer questions about the content. This is the JavaScript equivalent of the Python version.

## Architecture Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PDF File      │───▶│  pdf-parse       │───▶│  Text Content   │
│ (Trip_Email.pdf)│    │   Library        │    │   (String)      │
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

#### **Constructor**
```javascript
constructor() {
    this.apiKey = process.env.NVIDIA_API_KEY;       // Load from .env
    this.invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
    this.model = "meta/llama-3.1-70b-instruct";     // High accuracy model
    this.pdfContent = "";                           // Stores extracted text
    this.pdfName = "";                              // Stores PDF filename
}
```

#### **PDF Loading Process**
```javascript
async loadPdf(pdfPath = "Trip_Email.pdf")
```

**Step-by-Step Flow:**

1. **Path Resolution**
   ```javascript
   if (!path.isAbsolute(pdfPath)) {
       pdfPath = path.join(__dirname, pdfPath);
   }
   ```
   - Converts relative paths to absolute paths
   - Uses Node.js path module for cross-platform compatibility

2. **File Existence Check**
   ```javascript
   if (!fs.existsSync(pdfPath)) {
       return `PDF file not found: ${pdfPath}`;
   }
   ```
   - Validates file exists before attempting to read
   - Provides clear error message if file missing

3. **File Reading**
   ```javascript
   const dataBuffer = fs.readFileSync(pdfPath);
   ```
   - Reads PDF file as binary buffer
   - Synchronous read for simplicity

4. **PDF Parsing**
   ```javascript
   const data = await pdf(dataBuffer);
   ```
   - Uses pdf-parse library to extract text
   - Asynchronous operation returns parsed data object

5. **Content Storage**
   ```javascript
   this.pdfContent = data.text;
   this.pdfName = path.basename(pdfPath);
   ```
   - Stores extracted text in instance variable
   - Saves filename for reference

#### **Question Answering Process**
```javascript
async askQuestion(question)
```

**Step-by-Step Flow:**

1. **Content Validation**
   ```javascript
   if (!this.pdfContent) {
       return "No PDF loaded. Please load a PDF first using loadPdf().";
   }
   ```

2. **Prompt Construction**
   ```javascript
   const prompt = `You are an AI assistant that answers questions based on a PDF document.

   DOCUMENT: ${this.pdfName}
   CONTENT:
   ${this.pdfContent.substring(0, 6000)}

   USER QUESTION: ${question}

   INSTRUCTIONS:
   - Answer the question based ONLY on the information in the document above
   - Be specific and accurate
   - If the information is not in the document, clearly state "This information is not available in the provided document"
   - Quote relevant parts when helpful
   - Keep your answer clear and concise
   - If it's about dates, locations, or specific details, be precise

   ANSWER:`;
   ```

3. **HTTP Request Setup**
   ```javascript
   const headers = {
       'Authorization': `Bearer ${this.apiKey}`,
       'Accept': 'application/json',
       'Content-Type': 'application/json'
   };

   const payload = {
       model: this.model,
       messages: [{ role: 'user', content: prompt }],
       max_tokens: 600,
       temperature: 0.2,        // Low temperature for factual accuracy
       top_p: 0.9,
       frequency_penalty: 0.0,
       presence_penalty: 0.0
   };
   ```

4. **API Call & Response Processing**
   ```javascript
   const response = await axios.post(this.invokeUrl, payload, { headers });
   const answer = response.data.choices[0].message.content.trim();
   return `Answer: ${answer}`;
   ```

## Interactive Session Flow

### Main Function
```javascript
async function startQASession()
```

**Execution Steps:**

1. **Readline Interface Setup**
   ```javascript
   const readline = require('readline');
   const rl = readline.createInterface({
       input: process.stdin,
       output: process.stdout
   });
   ```

2. **Agent Initialization**
   ```javascript
   const agent = new PDFReaderAgent();
   ```

3. **Auto PDF Loading**
   ```javascript
   const result = await agent.loadPdf("Trip_Email.pdf");
   ```

4. **Document Summary Generation**
   ```javascript
   const summary = await agent.getDocumentSummary();
   ```

5. **Recursive Question Loop**
   ```javascript
   const askQuestion = () => {
       rl.question("\nYour question: ", async (question) => {
           // Process question
           // Get AI response
           // Continue loop or exit
           askQuestion(); // Recursive call
       });
   };
   ```

## Asynchronous Flow Management

### Promise-Based Architecture
```javascript
// All PDF and API operations are async
async loadPdf(pdfPath)          // Returns Promise<string>
async askQuestion(question)     // Returns Promise<string>
async getDocumentSummary()      // Returns Promise<string>
```

### Error Handling with Async/Await
```javascript
try {
    const response = await axios.post(this.invokeUrl, payload, { headers });
    // Process response
} catch (error) {
    if (error.response) {
        return `API Error: ${error.response.status} - ${error.response.data.error?.message}`;
    }
    return `API Error: ${error.message}`;
}
```

## Module System

### CommonJS Export/Import
```javascript
// Export class for use as module
module.exports = PDFReaderAgent;

// Usage in other files
const PDFReaderAgent = require('./pdf_agent');
```

### Conditional Execution
```javascript
// Run if called directly
if (require.main === module) {
    startQASession().catch(console.error);
}
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

## Dependencies

### Required Packages
```javascript
const fs = require('fs');           // File system operations
const path = require('path');       // Path manipulation
const axios = require('axios');     // HTTP client for API calls
const pdf = require('pdf-parse');   // PDF text extraction
require('dotenv').config();         // Environment variable loading
```

### Package.json Configuration
```json
{
  "dependencies": {
    "axios": "^1.6.0",      // HTTP client
    "pdf-parse": "^1.1.1",  // PDF parser
    "dotenv": "^16.3.1"     // Environment variables
  }
}
```

### Installation
```bash
npm install axios pdf-parse dotenv
```

## Error Handling Strategies

### File Operations
```javascript
try {
    if (!fs.existsSync(pdfPath)) {
        return `PDF file not found: ${pdfPath}`;
    }
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
} catch (error) {
    return `Error reading PDF: ${error.message}`;
}
```

### API Operations
```javascript
try {
    const response = await axios.post(this.invokeUrl, payload, { headers });
    // Success handling
} catch (error) {
    if (error.response) {
        // HTTP error with response
        return `API Error: ${error.response.status} - ${error.response.data.error?.message || error.response.statusText}`;
    }
    // Network or other error
    return `API Error: ${error.message}`;
}
```

## Usage Examples

### Basic Usage
```javascript
const PDFReaderAgent = require('./pdf_agent');

async function example() {
    const agent = new PDFReaderAgent();
    await agent.loadPdf("Trip_Email.pdf");
    const answer = await agent.askQuestion("Who is travelling from where to where?");
    console.log(answer);
}

example();
```

### Interactive Session
```bash
node pdf_agent.js
```

### Programmatic Usage
```javascript
const agent = new PDFReaderAgent();

(async () => {
    const result = await agent.loadPdf("document.pdf");
    
    if (result.includes("Successfully loaded")) {
        const summary = await agent.getDocumentSummary();
        const answer = await agent.askQuestion("What is the main topic?");
        console.log(summary);
        console.log(answer);
    }
})();
```

## Performance Considerations

### Optimization Features
- **Async/Await**: Non-blocking operations
- **Content Truncation**: Limits text sent to API (6000 chars)
- **Efficient Parsing**: Single-pass PDF extraction
- **Memory Management**: Buffers cleaned after use

### Node.js Specific Benefits
- **Event Loop**: Non-blocking I/O operations
- **Stream Processing**: Efficient for large files
- **Memory Efficiency**: Garbage collection
- **Fast Execution**: V8 JavaScript engine

## Security Features

### Environment Variables
```javascript
require('dotenv').config();  // Loads from .env file
this.apiKey = process.env.NVIDIA_API_KEY;
```

### Input Validation
- File existence checks before processing
- Content validation before API calls
- Error message sanitization
- No eval() or dangerous operations

## Readline Interface Management

### Interactive Input Handling
```javascript
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Proper cleanup
rl.question("Your question: ", (answer) => {
    // Process answer
    rl.close(); // Important: close interface when done
});
```

### Recursive Question Loop
```javascript
const askQuestion = () => {
    rl.question("\nYour question: ", async (question) => {
        // Process question
        if (shouldExit) {
            rl.close();
            return;
        }
        askQuestion(); // Continue loop
    });
};
```

## Troubleshooting

### Common Issues
1. **"PDF file not found"**: Check file path and existence
2. **"API Error"**: Verify NVIDIA_API_KEY in .env file
3. **"No PDF loaded"**: Call loadPdf() before askQuestion()
4. **Module errors**: Run `npm install` to install dependencies

### Debug Steps
1. Check .env file exists and contains API key
2. Verify PDF file is in correct location
3. Run `npm install` to ensure dependencies
4. Test with simple questions first
5. Check internet connection for API calls

### Node.js Specific Debugging
```javascript
// Add debug logging
console.log('API Key loaded:', !!this.apiKey);
console.log('PDF content length:', this.pdfContent.length);
console.log('Response status:', response.status);
```

## Comparison with Python Version

### Similarities
- Same AI model and parameters
- Identical prompt structure
- Same error handling approach
- Similar class structure

### Differences
- **Async/Await**: Native async support in Node.js
- **Package Management**: npm vs pip
- **PDF Library**: pdf-parse vs PyPDF2
- **HTTP Client**: axios vs requests
- **Module System**: CommonJS vs Python imports