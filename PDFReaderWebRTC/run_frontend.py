#!/usr/bin/env python3
"""
Frontend runner for PDFReaderWebRTC
Ensures dependencies are installed and starts the React development server
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_node_version():
    """Check if Node.js is installed and version is adequate"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        version = result.stdout.strip()
        print(f"📦 Node.js version: {version}")
        
        # Extract major version number
        major_version = int(version.replace('v', '').split('.')[0])
        if major_version < 16:
            print("⚠️  Node.js version 16 or higher is recommended")
            return False
        return True
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js 16 or higher")
        return False

def install_dependencies():
    """Install npm dependencies"""
    print("📦 Installing React dependencies...")
    try:
        subprocess.run(['npm', 'install'], check=True, capture_output=True, text=True)
        print("✅ React dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_dependencies():
    """Check if all required dependencies are installed"""
    package_json_path = Path("package.json")
    if not package_json_path.exists():
        print("❌ package.json not found")
        return False
    
    with open(package_json_path, 'r') as f:
        package_data = json.load(f)
    
    required_deps = [
        'react', 'react-dom', 'axios', 'lucide-react', 
        'clsx', 'tailwind-merge', 'framer-motion', 'tailwindcss'
    ]
    
    dependencies = package_data.get('dependencies', {})
    missing_deps = [dep for dep in required_deps if dep not in dependencies]
    
    if missing_deps:
        print(f"❌ Missing dependencies: {missing_deps}")
        return False
    
    print("✅ All required dependencies found in package.json")
    return True

def start_react_server():
    """Start the React development server"""
    print("\n🚀 Starting React development server...")
    print("Frontend will be available at: http://localhost:3000")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        subprocess.run(['npm', 'start'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting React server: {e}")
        sys.exit(1)

def main():
    """Main function"""
    print("=" * 60)
    print("⚛️  PDFReaderWebRTC Frontend Server")
    print("=" * 60)
    
    # Change to frontend directory
    frontend_dir = Path(__file__).parent / "frontend"
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        sys.exit(1)
    
    os.chdir(frontend_dir)
    
    # Check Node.js
    if not check_node_version():
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("Installing missing dependencies...")
        if not install_dependencies():
            sys.exit(1)
    
    # Check if node_modules exists
    if not Path("node_modules").exists():
        print("📦 node_modules not found, installing dependencies...")
        if not install_dependencies():
            sys.exit(1)
    
    # Start React server
    start_react_server()

if __name__ == "__main__":
    main()