"""
🤖🪞 Mirror Mirror on the Wall - Main Flask Application
The world's first fake deepfake therapy app where you roast yourself.

"Because sometimes, the only person qualified to give you terrible advice... is also you."
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

# Import our custom services
from app.services.roast_therapist import RoastTherapistService
from app.services.face_processor import FaceProcessorService
from app.services.avatar_generator import AvatarGeneratorService

def create_app():
    """Create and configure the Flask app"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mirror_mirror_secret')
    app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '../uploads')
    app.config['AVATAR_FOLDER'] = os.getenv('AVATAR_FOLDER', '../generated_avatars')
    
    # Enable CORS for frontend
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)
    
    # Initialize SocketIO for real-time therapy sessions
    socketio = SocketIO(app, cors_allowed_origins="*")
    
    # Initialize services
    roast_service = RoastTherapistService()
    face_service = FaceProcessorService()
    avatar_service = AvatarGeneratorService()
    
    # Create upload directories
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['AVATAR_FOLDER'], exist_ok=True)
    
    # Routes
    from app.api.routes import create_routes
    create_routes(app, roast_service, face_service, avatar_service)
    
    # WebSocket events for real-time therapy
    @socketio.on('start_therapy_session')
    def handle_therapy_session(data):
        """Start a live therapy session with deepfake you"""
        session_id = str(uuid.uuid4())
        avatar_id = data.get('avatar_id')
        
        emit('session_started', {
            'session_id': session_id,
            'message': "Welcome to therapy with yourself. This is either genius or concerning. Let's find out which.",
            'timestamp': datetime.now().isoformat()
        })
    
    @socketio.on('therapy_message')
    def handle_therapy_message(data):
        """Handle therapy chat messages"""
        user_message = data.get('message', '')
        session_id = data.get('session_id', '')
        
        # Get roasted therapy response
        therapy_response = roast_service.generate_therapy_response(user_message)
        
        emit('therapy_response', {
            'session_id': session_id,
            'response': therapy_response,
            'useless_meter': roast_service.calculate_uselessness_score(therapy_response),
            'timestamp': datetime.now().isoformat()
        })
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnect"""
        emit('session_ended', {
            'message': "Session ended. Remember: you can't run from yourself... but you can try!"
        })
    
    return app, socketio

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
