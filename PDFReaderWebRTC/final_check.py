#!/usr/bin/env python3
"""
Final verification that PDFReaderWebRTC is working properly
"""

import os
import sys
import subprocess
import json

def check_backend():
    """Test backend functionality"""
    try:
        # Test imports
        import flask
        import flask_cors
        import PyPDF2
        import requests
        import dotenv
        
        # Test app import
        sys.path.append('backend')
        from app import app
        
        print("[OK] Backend: All dependencies and imports working")
        return True
    except Exception as e:
        print(f"[ERROR] Backend: {e}")
        return False

def check_frontend():
    """Test frontend setup"""
    try:
        # Check if node_modules exists
        if not os.path.exists('frontend/node_modules'):
            print("[ERROR] Frontend: node_modules not found")
            return False
        
        # Check package.json
        with open('frontend/package.json', 'r') as f:
            package = json.load(f)
            
        required_deps = ['react', 'react-dom', 'axios', 'lucide-react', 'framer-motion']
        missing = [dep for dep in required_deps if dep not in package.get('dependencies', {})]
        
        if missing:
            print(f"[ERROR] Frontend: Missing dependencies: {missing}")
            return False
            
        print("[OK] Frontend: All dependencies installed")
        return True
    except Exception as e:
        print(f"[ERROR] Frontend: {e}")
        return False

def check_files():
    """Check essential files exist"""
    essential_files = [
        'backend/app.py',
        'backend/pdf_agent.py', 
        'backend/.env',
        'frontend/src/App.jsx',
        'frontend/src/components/PDFUpload.jsx',
        'frontend/src/components/VoiceChat.jsx',
        'frontend/src/hooks/useVoice.js',
        'frontend/src/utils/api.js'
    ]
    
    missing_files = []
    for file_path in essential_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"[ERROR] Missing files: {missing_files}")
        return False
    
    print("[OK] All essential files present")
    return True

def main():
    print("PDFReaderWebRTC - Final Status Check")
    print("=" * 40)
    
    # We're already in PDFReaderWebRTC directory
    # os.chdir('PDFReaderWebRTC')
    
    all_good = True
    
    # Check files
    if not check_files():
        all_good = False
    
    # Check backend
    if not check_backend():
        all_good = False
    
    # Check frontend
    if not check_frontend():
        all_good = False
    
    print("\n" + "=" * 40)
    if all_good:
        print("[SUCCESS] PDFReaderWebRTC is ready!")
        print("\nTo start the application:")
        print("1. Backend: cd backend && python app.py")
        print("2. Frontend: cd frontend && npm start")
        print("3. Open: http://localhost:3000")
        print("\nFeatures:")
        print("- PDF upload (drag & drop or click)")
        print("- Voice recognition (microphone button)")
        print("- Text-to-speech responses")
        print("- AI-powered Q&A with NVIDIA Llama 3.1")
    else:
        print("[ERROR] Issues found - check messages above")
    
    return all_good

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)