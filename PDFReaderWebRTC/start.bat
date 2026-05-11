@echo off
echo ========================================
echo  PDF Reader WebRTC Voice AI - Enhanced
echo ========================================
echo.

echo [INFO] Checking system requirements...

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo [OK] Python and Node.js are available
echo.

echo [1/5] Cleaning previous session...
:: Clean any existing uploaded files
if exist "backend\uploaded_pdfs" (
    rmdir /s /q "backend\uploaded_pdfs"
    echo [OK] Cleaned uploaded files
)
mkdir "backend\uploaded_pdfs" 2>nul

echo.
echo [2/5] Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies!
    echo Please check your Python installation and internet connection.
    pause
    exit /b 1
)
echo [OK] Python dependencies installed

echo.
echo [3/5] Installing React dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install React dependencies!
    echo Please check your Node.js installation and internet connection.
    pause
    exit /b 1
)
echo [OK] React dependencies installed

echo.
echo [4/5] Starting Flask backend server...
cd ..\backend
start "PDF AI Backend" cmd /k "echo Starting Flask server... && python app.py"

echo [INFO] Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

echo.
echo [5/5] Starting React frontend...
cd ..\frontend
start "PDF AI Frontend" cmd /k "echo Starting React development server... && npm start"

echo.
echo ========================================
echo  Application Starting Successfully!
echo ========================================
echo.
echo Backend Server: http://localhost:5000
echo Frontend App:   http://localhost:3000
echo.
echo [IMPORTANT] Wait for both servers to fully start:
echo - Backend: Look for "Running on http://0.0.0.0:5000"
echo - Frontend: Look for "webpack compiled successfully"
echo.
echo Both servers are running in separate windows.
echo You can close this launcher window now.
echo.
echo Features Available:
echo - PDF Upload (drag & drop or browse)
echo - Voice Recognition (microphone button)
echo - Text-to-Speech responses
echo - AI-powered Q&A with NVIDIA Llama 3.1
echo.
echo Troubleshooting:
echo - If backend fails: Check NVIDIA_API_KEY in backend\.env
echo - If frontend fails: Try running 'npm install' in frontend folder
echo - For voice issues: Allow microphone access in browser
echo.
echo Press any key to exit this launcher...
pause > nul