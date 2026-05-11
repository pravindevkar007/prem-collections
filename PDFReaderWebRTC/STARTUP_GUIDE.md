# PDFReaderWebRTC - Quick Start Guide

## 🚀 How to Start the Application

### Method 1: Automatic Start (Windows)
```bash
# Run the automated startup script
start.bat
```

### Method 2: Manual Start (Recommended for troubleshooting)

#### Step 1: Start Backend Server
Open a new terminal/command prompt:
```bash
cd PDFReaderWebRTC
python run_backend.py
```
OR
```bash
cd PDFReaderWebRTC\backend
python app.py
```

#### Step 2: Start Frontend (in a separate terminal)
Open another terminal/command prompt:
```bash
cd PDFReaderWebRTC\frontend
npm start
```

## 🌐 Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Troubleshooting

### Frontend Issues
1. **React Warning about `asChild` prop**: Fixed in latest version
2. **Port 3000 already in use**: 
   - Kill existing process or use different port
   - React will automatically suggest port 3001

### Backend Issues
1. **Cannot connect to backend**: 
   - Make sure Flask server is running on port 5000
   - Check if Python dependencies are installed: `pip install -r backend/requirements.txt`
   - Verify NVIDIA API key in `backend/.env`

2. **Module not found errors**:
   - Install Python dependencies: `cd backend && pip install -r requirements.txt`

### Common Solutions
1. **Clean restart**:
   ```bash
   # Stop all servers (Ctrl+C in terminals)
   # Then restart both backend and frontend
   ```

2. **Dependency issues**:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend  
   cd frontend
   npm install
   ```

## 📋 Usage Flow
1. Start both backend and frontend servers
2. Open http://localhost:3000 in your browser
3. Upload a PDF file (drag & drop or browse)
4. Wait for AI to process and generate summary
5. Ask questions using text input or voice (microphone button)
6. Get AI responses with automatic text-to-speech

## 🎤 Voice Features
- **Speech Recognition**: Click microphone button and speak
- **Text-to-Speech**: Responses are automatically read aloud
- **Browser Compatibility**: Works best in Chrome/Edge

## 🔑 Requirements
- Python 3.8+ with Flask dependencies
- Node.js 16+ with React dependencies  
- NVIDIA API key configured in backend/.env
- Modern browser (Chrome/Edge recommended for voice features)