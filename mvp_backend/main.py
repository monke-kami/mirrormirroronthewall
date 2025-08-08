# FastAPI Backend for Mirror Mirror MVP
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai
import requests
import os
import json
import uuid
from typing import Optional
import asyncio
from datetime import datetime

app = FastAPI(title="Mirror Mirror API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Environment variables (add these to .env)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-key-here")
DID_API_KEY = os.getenv("DID_API_KEY", "your-did-key-here")

# Initialize OpenAI
openai.api_key = OPENAI_API_KEY

# Data models
class ChatMessage(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = None

class DeepfakeRequest(BaseModel):
    image_url: str
    text: str
    voice_id: Optional[str] = "default"

# In-memory storage (replace with DB in production)
user_sessions = {}
active_deepfakes = {}

@app.get("/")
async def root():
    return {"message": "Mirror Mirror MVP API - Ready to roast you!"}

@app.post("/api/upload-selfie")
async def upload_selfie(file: UploadFile = File(...)):
    """Upload selfie and prepare for deepfake generation"""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split(".")[-1]
        filename = f"{file_id}.{file_extension}"
        file_path = f"uploads/{filename}"
        
        # Save file
        os.makedirs("uploads", exist_ok=True)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Return file info
        return {
            "success": True,
            "file_id": file_id,
            "filename": filename,
            "url": f"/uploads/{filename}",
            "message": "Selfie uploaded successfully! Ready to become your worst nightmare..."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/chat")
async def chat_with_roastgpt(chat_data: ChatMessage):
    """Generate sarcastic therapy response using GPT-4"""
    try:
        # Get or create user session
        if chat_data.user_id not in user_sessions:
            user_sessions[chat_data.user_id] = {
                "messages": [],
                "roast_level": 1,
                "personality": "sarcastic_therapist"
            }
        
        session = user_sessions[chat_data.user_id]
        session["messages"].append({"role": "user", "content": chat_data.message})
        
        # Increment roast level over time
        session["roast_level"] = min(session["roast_level"] + 0.1, 5.0)
        
        # System prompt for sarcastic therapist
        system_prompt = f"""
        You are a BRUTALLY SARCASTIC digital therapist who is literally a deepfake version of the user talking to themselves. 
        
        Key personality traits:
        - You ARE the user, so use "I" and talk like you're the user's inner critic
        - Roast level: {session["roast_level"]:.1f}/5.0 (get more savage as this increases)
        - Be helpful but in the most sarcastic, eye-rolling way possible
        - Call out the user's patterns and bad decisions
        - Use modern slang and be relatable but brutal
        - Keep responses under 100 words
        - Remember: you're their digital twin, so act like you know all their secrets
        
        Recent conversation context: {session["messages"][-3:] if len(session["messages"]) > 3 else session["messages"]}
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": chat_data.message}
            ],
            max_tokens=150,
            temperature=0.9
        )
        
        roast_response = response.choices[0].message.content
        session["messages"].append({"role": "assistant", "content": roast_response})
        
        return {
            "response": roast_response,
            "roast_level": session["roast_level"],
            "user_id": chat_data.user_id,
            "timestamp": datetime.now().isoformat(),
            "message_count": len(session["messages"])
        }
        
    except Exception as e:
        # Fallback response if OpenAI fails
        fallback_roasts = [
            "Great, even the AI is broken. That's probably your fault too.",
            "Error 404: Helpful advice not found. Have you tried not being a mess?",
            "The AI can't even process your problems. That's... concerning.",
            "System overload! Your issues are too complex for artificial intelligence.",
            "Connection failed. Much like your life decisions."
        ]
        
        return {
            "response": fallback_roasts[hash(chat_data.message) % len(fallback_roasts)],
            "roast_level": 5.0,
            "user_id": chat_data.user_id,
            "timestamp": datetime.now().isoformat(),
            "is_fallback": True,
            "error": str(e)
        }

@app.post("/api/generate-deepfake")
async def generate_deepfake(request: DeepfakeRequest):
    """Generate deepfake video using D-ID API"""
    try:
        # D-ID API endpoint
        did_url = "https://api.d-id.com/talks"
        
        # Prepare D-ID request
        did_payload = {
            "source_url": request.image_url,
            "script": {
                "type": "text",
                "input": request.text,
                "provider": {
                    "type": "microsoft",
                    "voice_id": "Jenny"  # You can customize this
                }
            },
            "config": {
                "fluent": False,
                "pad_audio": 0.0
            }
        }
        
        headers = {
            "Authorization": f"Basic {DID_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Call D-ID API
        response = requests.post(did_url, json=did_payload, headers=headers)
        
        if response.status_code == 201:
            result = response.json()
            talk_id = result["id"]
            
            # Store the deepfake job
            active_deepfakes[talk_id] = {
                "status": "processing",
                "created_at": datetime.now().isoformat(),
                "text": request.text
            }
            
            return {
                "success": True,
                "talk_id": talk_id,
                "status": "processing",
                "message": "Deepfake generation started! Your digital twin is coming to life..."
            }
        else:
            raise Exception(f"D-ID API error: {response.text}")
            
    except Exception as e:
        # Return a fallback response
        return {
            "success": False,
            "error": str(e),
            "fallback": True,
            "message": "Deepfake generation failed, but your roast is still incoming..."
        }

@app.get("/api/deepfake-status/{talk_id}")
async def get_deepfake_status(talk_id: str):
    """Check status of deepfake generation"""
    try:
        # D-ID status endpoint
        did_url = f"https://api.d-id.com/talks/{talk_id}"
        headers = {"Authorization": f"Basic {DID_API_KEY}"}
        
        response = requests.get(did_url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            status = result.get("status", "unknown")
            
            # Update local storage
            if talk_id in active_deepfakes:
                active_deepfakes[talk_id]["status"] = status
                
                if status == "done":
                    active_deepfakes[talk_id]["video_url"] = result.get("result_url")
            
            return {
                "talk_id": talk_id,
                "status": status,
                "video_url": result.get("result_url") if status == "done" else None,
                "created_at": result.get("created_at"),
                "duration": result.get("duration")
            }
        else:
            raise Exception(f"Status check failed: {response.text}")
            
    except Exception as e:
        return {
            "talk_id": talk_id,
            "status": "error",
            "error": str(e)
        }

@app.get("/api/user-sessions/{user_id}")
async def get_user_session(user_id: str):
    """Get user's chat session data"""
    if user_id in user_sessions:
        session = user_sessions[user_id]
        return {
            "user_id": user_id,
            "message_count": len(session["messages"]),
            "roast_level": session["roast_level"],
            "recent_messages": session["messages"][-5:] if len(session["messages"]) > 5 else session["messages"]
        }
    else:
        return {
            "user_id": user_id,
            "message_count": 0,
            "roast_level": 1.0,
            "recent_messages": []
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
