from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import shutil
from werkzeug.utils import secure_filename
from pdf_agent import PDFReaderAgent

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploaded_pdfs'
ALLOWED_EXTENSIONS = {'pdf'}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global PDF agent instance
pdf_agent = PDFReaderAgent()
current_pdf_path = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    global current_pdf_path
    
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF file provided'}), 400
    
    file = request.files['pdf']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save the uploaded file
        file.save(filepath)
        current_pdf_path = filepath
        
        # Load the PDF into the agent
        result = pdf_agent.load_pdf(filepath)
        
        if "Successfully loaded" in result:
            return jsonify({
                'message': 'PDF uploaded and loaded successfully',
                'filename': filename,
                'details': result
            })
        else:
            return jsonify({'error': f'Failed to load PDF: {result}'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload a PDF file.'}), 400

@app.route('/ask-question', methods=['POST'])
def ask_question():
    data = request.get_json()
    
    if not data or 'question' not in data:
        return jsonify({'error': 'No question provided'}), 400
    
    question = data['question']
    
    if not current_pdf_path:
        return jsonify({'error': 'No PDF loaded. Please upload a PDF first.'}), 400
    
    # Get answer from the PDF agent
    answer = pdf_agent.ask_question(question)
    
    return jsonify({
        'question': question,
        'answer': answer
    })

@app.route('/summary', methods=['GET'])
def get_summary():
    if not current_pdf_path:
        return jsonify({'error': 'No PDF loaded. Please upload a PDF first.'}), 400
    
    summary = pdf_agent.get_document_summary()
    
    return jsonify({
        'summary': summary,
        'pdf_name': pdf_agent.pdf_name
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'pdf_loaded': current_pdf_path is not None,
        'current_pdf': pdf_agent.pdf_name if current_pdf_path else None
    })

@app.route('/reset', methods=['POST'])
def reset_session():
    global current_pdf_path
    
    # Clear the current session
    current_pdf_path = None
    pdf_agent.pdf_content = ""
    pdf_agent.pdf_name = ""
    
    # Clean up uploaded files
    try:
        if os.path.exists(UPLOAD_FOLDER):
            shutil.rmtree(UPLOAD_FOLDER)
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    except Exception as e:
        print(f"Error cleaning upload folder: {e}")
    
    return jsonify({'message': 'Session reset successfully'})

if __name__ == '__main__':
    print("Starting PDF Reader Voice AI Server...")
    print("Upload folder:", os.path.abspath(UPLOAD_FOLDER))
    print("Server running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)