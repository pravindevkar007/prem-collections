# PDF Reader WebRTC Voice AI

A complete voice-enabled PDF reader application with WebRTC capabilities. Upload PDFs and interact with them using voice commands and get spoken responses powered by AI.

## 🚀 Features

- **📄 PDF Upload**: Drag & drop or browse to upload PDF files
- **🎤 Voice Input**: Use WebRTC speech recognition to ask questions
- **🔊 Voice Output**: Get AI responses read aloud using text-to-speech
- **💬 Real-time Chat**: Interactive conversation interface with your PDF
- **📋 Document Summary**: Automatic AI-generated PDF summaries
- **🧠 AI-Powered**: Uses NVIDIA's Llama 3.1 70B model for intelligent responses
- **🌐 WebRTC Integration**: Browser-native voice communication

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **WebRTC APIs** - Speech Recognition & Text-to-Speech
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icons

### Backend
- **Flask** - Python web framework
- **PyPDF2** - PDF text extraction
- **NVIDIA API** - AI language model integration
- **Flask-CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **NVIDIA API Key** (for AI functionality)
- **Modern Browser** (Chrome/Edge recommended for full WebRTC support)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
cd PDFReaderWebRTC
```

### 2. Configure Environment
Edit `backend/.env` and add your NVIDIA API key:
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### 3. Run the Application
**Option A - Automatic (Windows):**
```bash
start.bat
```

**Option B - Manual:**
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 How to Use

1. **Upload PDF**: 
   - Drag & drop a PDF file or click to browse
   - Wait for processing and summary generation

2. **Ask Questions**:
   - Type questions in the chat interface
   - OR click the microphone 🎤 button and speak
   - Press Enter or click Send

3. **Voice Features**:
   - 🎤 **Microphone**: Start/stop voice recognition
   - 🔊 **Speaker**: Read text aloud or stop speaking
   - Responses are automatically read aloud

4. **Chat History**:
   - View conversation history
   - Clear chat when needed
   - Timestamps for each message

## 🏗 Project Structure

```
PDFReaderWebRTC/
├── backend/                    # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── pdf_agent.py           # PDF processing & AI logic
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── uploaded_pdfs/         # PDF storage (auto-created)
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PDFUpload.jsx  # File upload interface
│   │   │   └── VoiceChat.jsx  # Voice chat interface
│   │   ├── hooks/
│   │   │   └── useVoice.js    # WebRTC voice hooks
│   │   ├── utils/
│   │   │   └── api.js         # Backend API calls
│   │   ├── App.jsx            # Main application
│   │   └── index.jsx          # React entry point
│   ├── public/
│   │   └── index.html         # HTML template
│   └── package.json           # React dependencies
├── start.bat                   # Windows startup script
└── README.md                   # This file
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-pdf` | Upload and process PDF file |
| POST | `/ask-question` | Ask questions about the PDF |
| GET | `/summary` | Get document summary |
| GET | `/health` | Backend health check |
| POST | `/reset` | Reset session and clear files |

## 🎤 WebRTC Voice Features

### Speech Recognition
- Uses Web Speech API (`webkitSpeechRecognition`)
- Real-time voice-to-text conversion
- Visual feedback during listening
- Error handling for permissions

### Text-to-Speech
- Uses Web Speech Synthesis API
- Automatic response reading
- Manual text reading capability
- Adjustable speech parameters

## 🌐 Browser Compatibility

| Browser | Speech Recognition | Text-to-Speech | Recommended |
|---------|-------------------|----------------|-------------|
| Chrome | ✅ Full Support | ✅ Full Support | ⭐ Yes |
| Edge | ✅ Full Support | ✅ Full Support | ⭐ Yes |
| Firefox | ⚠️ Limited | ✅ Full Support | ⚠️ Partial |
| Safari | ⚠️ Limited | ✅ Full Support | ⚠️ Partial |

## 🔧 Configuration

### Environment Variables (backend/.env)
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### API Configuration
The application uses NVIDIA's API with the following model:
- **Model**: `meta/llama-3.1-70b-instruct`
- **Temperature**: 0.2 (for factual accuracy)
- **Max Tokens**: 600

## 🚨 Troubleshooting

### Common Issues

1. **"Backend Disconnected" Error**
   - Ensure Flask server is running: `cd backend && python app.py`
   - Check if port 5000 is available
   - Verify Python dependencies are installed

2. **Voice Recognition Not Working**
   - Grant microphone permissions in browser
   - Use Chrome or Edge for best compatibility
   - Check browser console for errors

3. **PDF Upload Fails**
   - Ensure file is a valid PDF
   - Check file size (recommended < 10MB)
   - Verify backend has write permissions

4. **AI Responses Not Working**
   - Check NVIDIA API key in `.env` file
   - Verify internet connection
   - Check API quota/limits

### Debug Mode
Run backend in debug mode:
```bash
cd backend
python app.py
```

## 🔒 Security Notes

- PDF files are stored locally in `backend/uploaded_pdfs/`
- Files are automatically cleaned on session reset
- API keys should be kept secure and not committed to version control
- CORS is enabled for localhost development

## 🚀 Production Deployment

For production deployment:

1. **Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Backend**:
   - Use a production WSGI server (gunicorn)
   - Configure proper CORS settings
   - Set up file storage and cleanup policies
   - Use environment variables for configuration

3. **Security**:
   - Implement file upload limits
   - Add authentication if needed
   - Use HTTPS for voice features
   - Secure API keys

## 📄 License

MIT License - Feel free to modify and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all dependencies are installed
- Verify API key configuration

---

**Enjoy your voice-enabled PDF reading experience! 🎉**