#!/usr/bin/env python3
"""
Enhanced backend runner for PDFReaderWebRTC
Ensures clean state and proper initialization
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

def setup_environment():
    """Setup the backend environment"""
    print("🔧 Setting up PDFReaderWebRTC Backend...")
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # Check if .env file exists
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Please create backend/.env with your NVIDIA_API_KEY")
        sys.exit(1)
    
    # Check if NVIDIA API key is configured
    with open(env_file, 'r') as f:
        env_content = f.read()
        if "NVIDIA_API_KEY=" not in env_content or "your_nvidia_api_key_here" in env_content:
            print("⚠️  Please configure your NVIDIA_API_KEY in backend/.env")
            print("Current .env content:")
            print(env_content)
    
    return True

def clean_uploaded_files():
    """Clean uploaded files directory"""
    upload_folder = Path("uploaded_pdfs")
    
    if upload_folder.exists():
        shutil.rmtree(upload_folder)
        print("🧹 Cleaned uploaded_pdfs directory")
    
    upload_folder.mkdir(exist_ok=True)
    print("📁 Created fresh uploaded_pdfs directory")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True, text=True)
        print("✅ Python dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        print("Error output:", e.stderr)
        return False

def start_flask_server():
    """Start the Flask server"""
    print("\n🚀 Starting Flask server...")
    print("Backend will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Import and run the Flask app
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

def main():
    """Main function"""
    print("=" * 60)
    print("🧠 PDFReaderWebRTC Backend Server")
    print("=" * 60)
    
    # Setup environment
    if not setup_environment():
        sys.exit(1)
    
    # Clean uploaded files
    clean_uploaded_files()
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Start server
    start_flask_server()

if __name__ == "__main__":
    main()