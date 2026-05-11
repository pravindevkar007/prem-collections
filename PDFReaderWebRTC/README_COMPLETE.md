# PDF Reader WebRTC Voice AI - Complete & Ready

A fully functional voice-enabled PDF reader application with WebRTC capabilities. Upload PDFs and interact with them using voice commands and get spoken responses powered by NVIDIA's AI.

## 🎆 Project Status: COMPLETE & READY TO USE

This project is **100% complete** with all features implemented and tested. All dependencies are configured and the application is ready for immediate use.

## 🚀 Features

- **📄 PDF Upload**: Drag & drop or browse to upload PDF files
- **🎤 Voice Input**: Use WebRTC speech recognition to ask questions
- **🔊 Voice Output**: Get AI responses read aloud using text-to-speech
- **💬 Real-time Chat**: Interactive conversation interface with your PDF
- **📋 Document Summary**: Automatic AI-generated PDF summaries
- **🧠 AI-Powered**: Uses NVIDIA's Llama 3.1 70B model for intelligent responses
- **🌐 WebRTC Integration**: Browser-native voice communication
- **🎨 Modern UI**: Beautiful, responsive design with animations

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **WebRTC APIs** - Speech Recognition & Text-to-Speech
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API communication

### Backend
- **Flask** - Python web framework
- **PyPDF2** - PDF text extraction
- **NVIDIA API** - AI language model integration
- **Flask-CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- **Python** (3.8 or higher) - [Download](https://python.org)
- **Node.js** (v16 or higher) - [Download](https://nodejs.org)
- **NVIDIA API Key** - [Get yours here](https://build.nvidia.com/)
- **Modern Browser** (Chrome/Edge recommended for full WebRTC support)

## 🚀 Quick Start (Recommended)

### 1. Get Your NVIDIA API Key
1. Visit [NVIDIA Build](https://build.nvidia.com/)
2. Sign up/Login and get your API key
3. Copy the API key for the next step

### 2. Configure Environment
Edit `backend/.env` and add your NVIDIA API key:
```env
NVIDIA_API_KEY=your_actual_nvidia_api_key_here
```

### 3. Start the Application
**Windows (Automatic):**
```bash
start.bat
```

**Manual Start:**
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
   - Listen to the AI-generated summary

2. **Ask Questions**:
   - Type questions in the chat interface
   - OR click the microphone 🎤 button and speak
   - Press Enter or click Send

3. **Voice Features**:
   - 🎤 **Microphone**: Start/stop voice recognition
   - 🔊 **Speaker**: Read text aloud or stop speaking
   - Responses are automatically read aloud

4. **Chat History**:
   - View conversation history with timestamps
   - Clear chat when needed
   - Visual indicators for AI speaking status

## 🌍 Browser Compatibility

| Browser | Speech Recognition | Text-to-Speech | Recommended |
|---------|-------------------|----------------|-------------|
| Chrome  | ✅ Full Support  | ✅ Full Support | ⭐ Best     |
| Edge    | ✅ Full Support  | ✅ Full Support | ⭐ Best     |
| Firefox | ⚠️ Limited       | ✅ Full Support | ⚠️ Partial  |
| Safari  | ⚠️ Limited       | ✅ Full Support | ⚠️ Partial  |

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-pdf` | Upload and process PDF file |
| POST | `/ask-question` | Ask questions about the PDF |
| GET | `/summary` | Get document summary |
| GET | `/health` | Backend health check |
| POST | `/reset` | Reset session and clear files |

## 🎤 Voice Features

### Speech Recognition
- Uses Web Speech API (`webkitSpeechRecognition`)
- Real-time voice-to-text conversion
- Visual feedback during listening
- Automatic error handling and recovery

### Text-to-Speech
- Uses Web Speech Synthesis API
- Automatic response reading with female voice
- Manual text reading capability
- Interrupt and resume functionality

## 🛠 Configuration

### Environment Variables (backend/.env)
```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### API Configuration
The application uses NVIDIA's API with:
- **Model**: `meta/llama-3.1-70b-instruct`
- **Temperature**: 0.2 (for factual accuracy)
- **Max Tokens**: 600

## 🚑 Troubleshooting

### Common Issues

1. **"Backend Disconnected" Error**
   - Ensure Flask server is running: `cd backend && python app.py`
   - Check if port 5000 is available
   - Verify Python dependencies: `pip install -r requirements.txt`

2. **Voice Recognition Not Working**
   - Grant microphone permissions in browser
   - Use Chrome or Edge for best compatibility
   - Check browser console for errors
   - See [Microphone Guide](MICROPHONE_GUIDE.md)

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

## 📝 Project Structure

```
PDFReaderWebRTC/
├── backend/                    # Flask Backend
│   ├── app.py                 # Main Flask application
│   ├── pdf_agent.py           # PDF processing & AI logic
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (NVIDIA API key)
│   └── uploaded_pdfs/         # PDF storage (auto-created)
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PDFUpload.jsx  # File upload interface
│   │   │   ├── VoiceChat.jsx  # Voice chat interface
│   │   │   └── ui/            # UI components (button, card, etc.)
│   │   ├── hooks/
│   │   │   └── useVoice.js    # WebRTC voice hooks
│   │   ├── utils/
│   │   │   └── api.js         # Backend API calls
│   │   ├── lib/
│   │   │   └── utils.js       # Utility functions
│   │   ├── App.jsx            # Main application
│   │   ├── index.jsx          # React entry point
│   │   └── index.css          # Tailwind CSS styles
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # React dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
├── start.bat                   # Windows startup script
├── clean_start_backend.py      # Clean backend startup
└── README.md                   # This file
```

## 🔒 Security Features

- ✅ File type validation (PDF only)
- ✅ Secure filename handling
- ✅ Temporary file storage with cleanup
- ✅ API key protection via environment variables
- ✅ CORS configuration for development

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

## 📝 Additional Documentation

- [Microphone Setup Guide](MICROPHONE_GUIDE.md)
- [Voice Flow Testing](VOICE_FLOW_TEST.md)
- [Clean State Guide](CLEAN_STATE_GUIDE.md)
- [Startup Guide](STARTUP_GUIDE.md)
- [Project Completion Summary](PROJECT_COMPLETION.md)

## 📝 License

MIT License - Feel free to modify and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for errors
- Ensure all dependencies are installed
- Verify API key configuration
- Check the additional documentation files

---

**🎉 Enjoy your voice-enabled PDF reading experience!**

*This project demonstrates the power of combining modern web technologies with AI to create intuitive, voice-driven user experiences.*