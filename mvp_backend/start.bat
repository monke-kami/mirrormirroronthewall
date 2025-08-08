@echo off
echo 🪞 Starting Mirror Mirror MVP Backend...

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create uploads directory
if not exist "uploads" mkdir uploads

REM Copy .env template if .env doesn't exist
if not exist ".env" (
    copy .env.template .env
    echo ⚠️  Please edit .env file with your API keys:
    echo    - OPENAI_API_KEY (for GPT-4)
    echo    - DID_API_KEY (for deepfake generation)
)

REM Start the server
echo 🚀 Starting FastAPI server on http://localhost:8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
