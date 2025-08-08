#!/bin/bash
# Startup script for Mirror Mirror MVP Backend

echo "🪞 Starting Mirror Mirror MVP Backend..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

# Copy .env template if .env doesn't exist
if [ ! -f ".env" ]; then
    cp .env.template .env
    echo "⚠️  Please edit .env file with your API keys:"
    echo "   - OPENAI_API_KEY (for GPT-4)"
    echo "   - DID_API_KEY (for deepfake generation)"
fi

# Start the server
echo "🚀 Starting FastAPI server on http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
