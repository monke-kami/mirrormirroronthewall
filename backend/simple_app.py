"""
🤖🪞 Mirror Mirror on the Wall - Simplified Flask Application
Simple version without SocketIO for testing
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'mirror_mirror_secret'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['UPLOAD_FOLDER'] = '../uploads'
app.config['AVATAR_FOLDER'] = '../generated_avatars'

# Enable CORS for frontend
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

# Create upload directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['AVATAR_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'message': 'Mirror Mirror API is running',
        'status': 'healthy',
        'therapy_quality': 'Consistently disappointing',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'message': 'Server is running and ready to provide questionable advice',
        'status': 'healthy',
        'therapy_quality': 'Consistently disappointing',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/upload-selfie', methods=['POST'])
def upload_selfie():
    """Upload and process a selfie"""
    try:
        if 'selfie' not in request.files:
            return jsonify({'success': False, 'message': 'No selfie file provided'}), 400
        
        file = request.files['selfie']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = secure_filename(f"{file_id}_{file.filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(file_path)
        
        return jsonify({
            'success': True,
            'message': 'Selfie uploaded successfully. Now we can judge you properly.',
            'data': {
                'file_id': file_id,
                'filename': filename,
                'file_path': file_path,
                'upload_time': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Upload failed: {str(e)}'}), 500

@app.route('/api/generate-avatar', methods=['POST'])
def generate_avatar():
    """Generate a therapy avatar from uploaded selfie"""
    try:
        data = request.get_json()
        file_id = data.get('file_id')
        therapy_mode = data.get('therapy_mode', 'condescending')
        
        if not file_id:
            return jsonify({'success': False, 'message': 'No file ID provided'}), 400
        
        # Mock avatar generation for now
        avatar_id = str(uuid.uuid4())
        avatar_filename = f"avatar_{avatar_id}.jpg"
        
        # In a real implementation, this would:
        # 1. Process the uploaded face
        # 2. Generate a deepfake avatar
        # 3. Apply therapy mode styling
        
        return jsonify({
            'success': True,
            'message': f'Avatar generated successfully in {therapy_mode} mode. Prepare for disappointment.',
            'data': {
                'avatar_id': avatar_id,
                'avatar_filename': avatar_filename,
                'therapy_mode': therapy_mode,
                'generation_time': datetime.now().isoformat(),
                'preview_text': f"Your {therapy_mode} therapist avatar is ready to provide terrible advice!"
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Avatar generation failed: {str(e)}'}), 500

@app.route('/api/therapy-session', methods=['POST'])
def start_therapy_session():
    """Start a therapy session"""
    try:
        data = request.get_json()
        avatar_id = data.get('avatar_id')
        message = data.get('message', '')
        
        if not avatar_id:
            return jsonify({'success': False, 'message': 'No avatar ID provided'}), 400
        
        # Mock therapy response
        responses = [
            "Well, well, well. Look who's talking to themselves again.",
            "Have you tried turning your life off and on again?",
            "I see the problem here... it's you.",
            "Let me guess, you want me to tell you everything will be okay? That's not how this works.",
            "The good news is, things can't get much worse. The bad news is, I was wrong.",
            "You know what your problem is? You're asking a fake therapist for real advice."
        ]
        
        import random
        response = random.choice(responses)
        
        return jsonify({
            'success': True,
            'data': {
                'response': response,
                'useless_meter': random.randint(85, 99),
                'session_id': str(uuid.uuid4()),
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Therapy session failed: {str(e)}'}), 500

@app.route('/api/therapy-modes', methods=['GET'])
def get_therapy_modes():
    """Get available therapy modes"""
    therapy_modes = [
        {
            "id": "condescending",
            "name": "Condescending Expert",
            "description": "Treats you like you couldn't figure out 2+2",
            "sample": "Obviously, the answer is right in front of you."
        },
        {
            "id": "overly_supportive",
            "name": "Toxic Positivity",
            "description": "Everything is sunshine and rainbows (but passive-aggressively)",
            "sample": "You're doing amazing! (At making poor choices.)"
        },
        {
            "id": "brutally_honest",
            "name": "Brutally Honest",
            "description": "No sugar-coating, just harsh reality",
            "sample": "Let's be real here - you're the problem."
        },
        {
            "id": "passive_aggressive",
            "name": "Passive Aggressive",
            "description": "Says one thing, means another",
            "sample": "That's... interesting. I'm sure it made sense to you."
        },
        {
            "id": "confused_intern",
            "name": "Confused Intern",
            "description": "Clearly has no idea what they're doing",
            "sample": "Hmm, let me Google that... I mean, consult my notes."
        }
    ]
    
    return jsonify({
        'success': True,
        'therapy_modes': therapy_modes
    })

if __name__ == '__main__':
    print("🤖🪞 Starting Mirror Mirror API server...")
    print("Preparing to provide questionable therapy advice...")
    app.run(debug=True, host='0.0.0.0', port=5000)
