"""
🤖🪞 Mirror Mirror on the Wall - Simple Auth Test Server
Testing authentication without the complex AI dependencies.

"Because sometimes, the only person qualified to give you terrible advice... is also you."
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

def create_app():
    """Create and configure the Flask app"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mirror_mirror_secret')
    app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '../uploads')
    app.config['AVATAR_FOLDER'] = os.getenv('AVATAR_FOLDER', '../generated_avatars')
    app.config['DATA_FOLDER'] = os.getenv('DATA_FOLDER', './data')
    
    # Enable CORS for frontend
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)
    
    # Initialize SocketIO for real-time therapy sessions
    socketio = SocketIO(app, cors_allowed_origins="*")
    
    # Create upload directories
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['AVATAR_FOLDER'], exist_ok=True)
    os.makedirs(app.config['DATA_FOLDER'], exist_ok=True)
    
    # Basic routes for testing
    @app.route('/', methods=['GET'])
    def home():
        """Welcome endpoint"""
        return jsonify({
            "message": "🤖🪞 Welcome to Mirror Mirror on the Wall!",
            "subtitle": "The therapy app that's definitely not FDA approved",
            "status": "Ready to disappoint you professionally (Authentication Enabled!)",
            "endpoints": {
                "auth": "/api/auth/*",
                "upload": "/api/upload-selfie",
                "health": "/api/health"
            },
            "disclaimer": "Not actual therapy. Please consult real professionals for real problems."
        })
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "message": "Authentication server is running and ready to provide questionable advice",
            "timestamp": datetime.now().isoformat(),
            "therapy_quality": "Consistently disappointing",
            "auth_enabled": True
        })
    
    # Simplified upload endpoint for testing
    @app.route('/api/upload-selfie', methods=['POST'])
    def upload_selfie():
        """Simplified selfie upload for testing"""
        return jsonify({
            "success": True,
            "message": "Upload endpoint working! (Simplified for auth testing)",
            "data": {
                "file_id": str(uuid.uuid4()),
                "status": "processed"
            }
        })
    
    # Authentication routes
    from app.api.auth_routes import create_auth_routes
    create_auth_routes(app)
    
    # WebSocket events for real-time therapy
    @socketio.on('start_therapy_session')
    def handle_therapy_session(data):
        """Start a live therapy session"""
        session_id = str(uuid.uuid4())
        
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
        
        # Simple response for testing
        therapy_response = f"Hmm, '{user_message}' - sounds like you need more therapy than our app can provide!"
        
        emit('therapy_response', {
            'session_id': session_id,
            'response': therapy_response,
            'useless_meter': 75,  # Fixed value for testing
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
    print("🔐 Starting Mirror Mirror Auth Server...")
    print("🌐 Authentication endpoints available at /api/auth/*")
    print("🚀 Server starting on http://localhost:5000")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
