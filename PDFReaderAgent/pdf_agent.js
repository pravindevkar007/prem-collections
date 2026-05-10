const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pdf = require('pdf-parse');
require('dotenv').config();

class PDFReaderAgent {
    constructor() {
        this.apiKey = process.env.NVIDIA_API_KEY;
        this.invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
        this.model = "meta/llama-3.1-70b-instruct";
        this.pdfContent = "";
        this.pdfName = "";
    }

    async loadPdf(pdfPath = "Trip_Email.pdf") {
        try {
            // Use absolute path if not already absolute
            if (!path.isAbsolute(pdfPath)) {
                pdfPath = path.join(__dirname, pdfPath);
            }

            // Check if file exists
            if (!fs.existsSync(pdfPath)) {
                return `PDF file not found: ${pdfPath}`;
            }

            // Read PDF file
            const dataBuffer = fs.readFileSync(pdfPath);
            
            console.log(`Reading PDF: ${path.basename(pdfPath)}`);
            
            // Parse PDF
            const data = await pdf(dataBuffer);
            
            this.pdfContent = data.text;
            this.pdfName = path.basename(pdfPath);
            
            console.log(`Total pages: ${data.numpages}`);
            
            return `Successfully loaded ${this.pdfName} (${data.numpages} pages, ${data.text.length} characters)`;
            
        } catch (error) {
            return `Error reading PDF: ${error.message}`;
        }
    }

    async askQuestion(question) {
        if (!this.pdfContent) {
            return "No PDF loaded. Please load a PDF first using loadPdf().";
        }

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

        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const payload = {
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600,
            temperature: 0.2,
            top_p: 0.9,
            frequency_penalty: 0.0,
            presence_penalty: 0.0
        };

        try {
            console.log("Analyzing document...");
            
            const response = await axios.post(this.invokeUrl, payload, { headers });
            
            const answer = response.data.choices[0].message.content.trim();
            return `Answer: ${answer}`;
            
        } catch (error) {
            if (error.response) {
                return `API Error: ${error.response.status} - ${error.response.data.error?.message || error.response.statusText}`;
            }
            return `API Error: ${error.message}`;
        }
    }

    async getDocumentSummary() {
        if (!this.pdfContent) {
            return "No PDF loaded.";
        }

        const summaryPrompt = `Provide a brief summary of this document:

DOCUMENT: ${this.pdfName}
CONTENT:
${this.pdfContent.substring(0, 4000)}

Create a concise summary covering:
- What type of document this is
- Main topics or subjects covered
- Key information or highlights
- Document structure (if relevant)

Keep it under 200 words.`;

        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const payload = {
            model: this.model,
            messages: [{ role: 'user', content: summaryPrompt }],
            max_tokens: 300,
            temperature: 0.3
        };

        try {
            const response = await axios.post(this.invokeUrl, payload, { headers });
            return response.data.choices[0].message.content.trim();
        } catch (error) {
            return `Error generating summary: ${error.message}`;
        }
    }
}

// Interactive Q&A function
async function startQASession() {
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const agent = new PDFReaderAgent();
    
    console.log("PDF Reader Agent - NVIDIA AI Powered (Node.js)");
    console.log("=".repeat(50));
    
    // Auto-load the Trip_Email.pdf
    const result = await agent.loadPdf("Trip_Email.pdf");
    console.log(result);
    
    if (!result.includes("Successfully loaded")) {
        console.log("Failed to load PDF. Exiting...");
        rl.close();
        return;
    }
    
    // Show document summary
    console.log("\nDocument Summary:");
    console.log("-".repeat(30));
    const summary = await agent.getDocumentSummary();
    console.log(summary);
    
    console.log("\n" + "=".repeat(50));
    console.log("Ask me anything about the document!");
    console.log("Commands: 'summary' for document overview, 'quit' to exit");
    console.log("=".repeat(50));
    
    // Question loop
    const askQuestion = () => {
        rl.question("\nYour question: ", async (question) => {
            question = question.trim();
            
            if (['quit', 'exit', 'q'].includes(question.toLowerCase())) {
                console.log("Goodbye!");
                rl.close();
                return;
            }
            
            if (question.toLowerCase() === 'summary') {
                console.log("\nDocument Summary:");
                const summary = await agent.getDocumentSummary();
                console.log(summary);
                askQuestion();
                return;
            }
            
            if (!question) {
                askQuestion();
                return;
            }
            
            // Get answer from AI
            const answer = await agent.askQuestion(question);
            console.log(`\n${answer}`);
            console.log("-".repeat(50));
            
            askQuestion();
        });
    };
    
    askQuestion();
}

// Export for use as module
module.exports = PDFReaderAgent;

// Run if called directly
if (require.main === module) {
    startQASession().catch(console.error);
}