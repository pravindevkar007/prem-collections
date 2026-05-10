from pdf_agent import PDFReaderAgent

def start_qa_session():
    """Start interactive Q&A session with PDF"""
    
    print("PDF Question & Answer Agent")
    print("=" * 40)
    
    # Initialize and load PDF
    agent = PDFReaderAgent()
    result = agent.load_pdf("Trip_Email.pdf")
    print(result)
    
    if "Successfully loaded" not in result:
        print("Could not load PDF. Please check if Trip_Email.pdf exists.")
        return
    
    print("\nYou can now ask questions about the PDF!")
    print("Type 'quit' to exit")
    print("-" * 40)
    
    while True:
        # Get user question
        question = input("\nQuestion: ").strip()
        
        # Check for exit
        if question.lower() in ['quit', 'exit', 'q', 'stop']:
            print("Session ended. Goodbye!")
            break
        
        # Skip empty questions
        if not question:
            continue
        
        # Get AI answer
        print("Getting answer...")
        answer = agent.ask_question(question)
        print("\n" + answer)
        print("-" * 40)

if __name__ == "__main__":
    start_qa_session()