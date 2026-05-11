#!/usr/bin/env python3
"""
Enhanced clean startup script for PDFReaderWebRTC backend
Ensures the server starts with completely clean state and proper error handling
"""

import os
import shutil
import sys
from pathlib import Path

def check_environment():
    """Check if environment is properly configured"""
    print("🔧 Checking environment configuration...")
    
    # Check if .env file exists
    env_file = Path('.env')
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Please create .env file with your NVIDIA_API_KEY")
        return False
    
    # Check if NVIDIA API key is configured
    with open(env_file, 'r') as f:
        env_content = f.read()
        if "NVIDIA_API_KEY=" not in env_content:
            print("❌ NVIDIA_API_KEY not found in .env file")
            return False
        
        # Check if it's still the placeholder
        if "your_nvidia_api_key_here" in env_content:
            print("⚠️  Please replace placeholder with actual NVIDIA_API_KEY in .env")
            print("Current .env content:")
            print(env_content)
            return False
    
    print("✅ Environment configuration looks good")
    return True

def clean_startup():
    """Clean all temporary files and start fresh"""
    print("="*60)
    print("🧠 PDFReaderWebRTC Backend - Clean Startup")
    print("="*60)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / 'backend'
    if backend_dir.exists():
        os.chdir(backend_dir)
        print(f"📁 Changed to backend directory: {backend_dir}")
    else:
        print("📁 Already in backend directory")
    
    # Check environment
    if not check_environment():
        print("\n❌ Environment check failed. Please fix the issues above.")
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Clean uploaded files directory
    upload_folder = Path('uploaded_pdfs')
    if upload_folder.exists():
        shutil.rmtree(upload_folder)
        print(f"🧹 Cleaned {upload_folder} directory")
    
    # Recreate empty directory
    upload_folder.mkdir(exist_ok=True)
    print(f"📁 Created fresh {upload_folder} directory")
    
    # Start the Flask app
    print("\n🚀 Starting Flask server...")
    print("Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except ImportError as e:
        print(f"\n❌ Import error: {e}")
        print("Please make sure all dependencies are installed:")
        print("pip install -r requirements.txt")
        input("Press Enter to exit...")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        input("Press Enter to exit...")
        sys.exit(1)

if __name__ == "__main__":
    clean_startup()