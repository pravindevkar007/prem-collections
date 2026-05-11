#!/usr/bin/env python3
"""
Test script to verify PDFReaderWebRTC project completeness
"""

import os
import sys
import subprocess
import json

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"[OK] {description}: {filepath}")
        return True
    else:
        print(f"[MISSING] {description}: {filepath} - NOT FOUND")
        return False

def check_python_imports():
    """Check if Python dependencies can be imported"""
    try:
        import flask
        import flask_cors
        import PyPDF2
        import requests
        import dotenv
        print("[OK] All Python dependencies available")
        return True
    except ImportError as e:
        print(f"[ERROR] Python dependency missing: {e}")
        return False

def check_env_file():
    """Check if .env file has required variables"""
    env_path = "backend/.env"
    if not os.path.exists(env_path):
        print(f"[ERROR] Environment file missing: {env_path}")
        return False
    
    with open(env_path, 'r') as f:
        content = f.read()
        if "NVIDIA_API_KEY" in content:
            print("[OK] NVIDIA_API_KEY found in .env file")
            return True
        else:
            print("[ERROR] NVIDIA_API_KEY not found in .env file")
            return False

def check_package_json():
    """Check if package.json has required dependencies"""
    package_path = "frontend/package.json"
    if not os.path.exists(package_path):
        print(f"[ERROR] Package.json missing: {package_path}")
        return False
    
    with open(package_path, 'r') as f:
        package_data = json.load(f)
        required_deps = [
            "react", "react-dom", "axios", "lucide-react", 
            "clsx", "tailwind-merge", "framer-motion"
        ]
        
        dependencies = package_data.get("dependencies", {})
        missing_deps = []
        
        for dep in required_deps:
            if dep not in dependencies:
                missing_deps.append(dep)
        
        if not missing_deps:
            print("[OK] All required React dependencies found")
            return True
        else:
            print(f"[ERROR] Missing React dependencies: {missing_deps}")
            return False

def main():
    """Main test function"""
    print("Testing PDFReaderWebRTC Project Completeness")
    print("=" * 50)
    
    # We're already in the PDFReaderWebRTC directory
    # os.chdir("PDFReaderWebRTC")
    
    all_checks_passed = True
    
    # Check essential files
    essential_files = [
        ("backend/app.py", "Flask main application"),
        ("backend/pdf_agent.py", "PDF processing agent"),
        ("backend/requirements.txt", "Python dependencies"),
        ("frontend/src/App.jsx", "React main component"),
        ("frontend/src/components/PDFUpload.jsx", "PDF upload component"),
        ("frontend/src/components/VoiceChat.jsx", "Voice chat component"),
        ("frontend/src/hooks/useVoice.js", "Voice recognition hooks"),
        ("frontend/src/utils/api.js", "API utilities"),
        ("frontend/package.json", "React dependencies"),
        ("frontend/tailwind.config.js", "Tailwind configuration"),
        ("start.bat", "Windows startup script"),
        ("README.md", "Project documentation")
    ]
    
    for filepath, description in essential_files:
        if not check_file_exists(filepath, description):
            all_checks_passed = False
    
    print("\nChecking Dependencies")
    print("-" * 30)
    
    # Check Python dependencies
    if not check_python_imports():
        all_checks_passed = False
    
    # Check environment file
    if not check_env_file():
        all_checks_passed = False
    
    # Check package.json
    if not check_package_json():
        all_checks_passed = False
    
    print("\nSummary")
    print("=" * 50)
    
    if all_checks_passed:
        print("[SUCCESS] PROJECT IS COMPLETE AND READY!")
        print("\nTo start the application:")
        print("   Option 1: Run start.bat (Windows)")
        print("   Option 2: Manual start:")
        print("     Terminal 1: cd backend && python app.py")
        print("     Terminal 2: cd frontend && npm start")
        print("\nAccess URLs:")
        print("   Frontend: http://localhost:3000")
        print("   Backend:  http://localhost:5000")
        return True
    else:
        print("[ERROR] PROJECT HAS MISSING COMPONENTS")
        print("Please check the failed items above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)