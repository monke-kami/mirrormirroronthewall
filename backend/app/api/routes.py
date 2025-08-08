"""
🛣️ API Routes for Mirror Mirror Therapy App
All the endpoints for maximum therapeutic disappointment.

"RESTful APIs for RESTless souls seeking questionable advice."
"""

from flask import request, jsonify, send_file
import os
import uuid
from datetime import datetime
from typing import Dict, Any
import json

from app.services.auth_service import optional_auth, token_required


def create_routes(app, roast_service, face_service, avatar_service):
    """Create all API routes for the therapy app"""
    
    @app.route('/', methods=['GET'])
    def home():
        """Welcome endpoint"""
        return jsonify({
            "message": "🤖🪞 Welcome to Mirror Mirror on the Wall!",
            "subtitle": "The therapy app that's definitely not FDA approved",
            "status": "Ready to disappoint you professionally",
            "endpoints": {
                "upload": "/api/upload-selfie",
                "generate": "/api/generate-avatar", 
                "therapy": "/api/therapy-session",
                "roast": "/api/roast-me"
            },
            "disclaimer": "Not actual therapy. Please consult real professionals for real problems."
        })
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "message": "Server is running and ready to provide questionable advice",
            "timestamp": datetime.now().isoformat(),
            "therapy_quality": "Consistently disappointing"
        })
    
    # 📷 SELFIE UPLOAD & PROCESSING
    @app.route('/api/upload-selfie', methods=['POST'])
    @optional_auth
    def upload_selfie(current_user):
        """Upload and process user selfie for avatar generation"""
        
        try:
            # Check if file was uploaded
            if 'selfie' not in request.files:
                return jsonify({
                    "error": "No selfie uploaded",
                    "message": "We need your face to disappoint you properly. Please upload a selfie."
                }), 400
            
            file = request.files['selfie']
            
            if file.filename == '':
                return jsonify({
                    "error": "No file selected",
                    "message": "Please select a file. We can't work with your imagination."
                }), 400
            
            # Validate file type
            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
            if not ('.' in file.filename and 
                   file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
                return jsonify({
                    "error": "Invalid file type",
                    "message": "Please upload an image file (PNG, JPG, JPEG, or GIF)",
                    "suggestion": "Try again with an actual image file"
                }), 400
            
            # Process the uploaded image
            result = face_service.process_uploaded_image(file, app.config['UPLOAD_FOLDER'])
            
            if result.get('error'):
                return jsonify(result), 400
            
            # Add user information if authenticated
            if current_user:
                result['user_id'] = current_user.user_id
                result['username'] = current_user.username
            
            return jsonify({
                "success": True,
                "message": "Selfie processed successfully! Face detected and ready for therapeutic mockery.",
                "data": result,
                "next_step": "Generate avatar using the file_id",
                "user_status": "authenticated" if current_user else "guest"
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Upload processing failed: {str(e)}",
                "message": "Something went wrong. Even we can't fix this one.",
                "suggestion": "Try again or blame technology"
            }), 500
    
    # 🎭 AVATAR GENERATION
    @app.route('/api/generate-avatar', methods=['POST'])
    def generate_avatar():
        """Generate therapist avatar from processed selfie"""
        
        try:
            data = request.get_json()
            
            if not data or 'file_id' not in data:
                return jsonify({
                    "error": "Missing file_id",
                    "message": "Please provide the file_id from the upload step"
                }), 400
            
            file_id = data['file_id']
            customization = data.get('customization', {})
            
            # Mock face data retrieval (in real app, this would be stored)
            # For now, we'll construct the expected data structure
            processed_path = os.path.join(app.config['UPLOAD_FOLDER'], f"processed_{file_id}.jpg")
            
            if not os.path.exists(processed_path):
                return jsonify({
                    "error": "Processed image not found",
                    "message": "The processed selfie seems to have vanished. Try uploading again."
                }), 404
            
            face_data = {
                'processed_path': processed_path,
                'file_id': file_id,
                'features': {
                    'size_category': 'medium',
                    'aspect_ratio': 1.2,
                    'suggested_accessories': ['therapist_glasses', 'notepad_small']
                },
                'position': (50, 50, 200, 250)  # Mock face coordinates
            }
            
            # Generate the avatar
            result = avatar_service.generate_therapist_avatar(face_data, customization)
            
            if result.get('error'):
                return jsonify(result), 500
            
            return jsonify({
                "success": True,
                "message": "Avatar generated! Your therapist doppelganger is ready to judge you.",
                "data": result,
                "next_step": "Start a therapy session using the avatar_id"
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Avatar generation failed: {str(e)}",
                "message": "Avatar creation went wrong. Probably user error.",
                "suggestion": "Try again or accept that even fake therapy doesn't want to help you"
            }), 500
    
    # 💬 THERAPY SESSION ENDPOINTS
    @app.route('/api/therapy-session', methods=['POST'])
    def start_therapy_session():
        """Start a new therapy session"""
        
        try:
            data = request.get_json()
            avatar_id = data.get('avatar_id')
            session_type = data.get('session_type', 'chat')  # 'chat' or 'video'
            
            if not avatar_id:
                return jsonify({
                    "error": "Missing avatar_id",
                    "message": "Which version of yourself do you want to be disappointed by?"
                }), 400
            
            # Create session
            session_id = str(uuid.uuid4())
            
            # Get avatar info
            avatar_info = avatar_service.get_avatar_info(avatar_id)
            if not avatar_info.get('success'):
                return jsonify({
                    "error": "Avatar not found",
                    "message": "Your therapist self seems to have abandoned you. How fitting."
                }), 404
            
            # Session data
            session_data = {
                "session_id": session_id,
                "avatar_id": avatar_id,
                "session_type": session_type,
                "started_at": datetime.now().isoformat(),
                "avatar_persona": avatar_info['avatar_data']['persona'],
                "therapy_style": avatar_info['avatar_data']['therapy_style'],
                "messages": []
            }
            
            # Welcome message from therapist
            welcome_response = roast_service.generate_therapy_response(
                "Hello, I'm here for therapy."
            )
            
            return jsonify({
                "success": True,
                "session_data": session_data,
                "welcome_message": welcome_response,
                "message": "Therapy session started. Prepare for disappointment.",
                "instructions": "Send messages to /api/therapy-message with session_id"
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Session creation failed: {str(e)}",
                "message": "Even starting therapy went wrong. That's... actually pretty on-brand."
            }), 500
    
    @app.route('/api/therapy-message', methods=['POST'])
    def therapy_message():
        """Send a message in therapy session"""
        
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            user_message = data.get('message', '')
            
            if not session_id or not user_message:
                return jsonify({
                    "error": "Missing session_id or message",
                    "message": "How can I judge you if you don't tell me what's wrong?"
                }), 400
            
            # Generate therapy response
            therapy_response = roast_service.generate_therapy_response(user_message)
            
            # Calculate uselessness
            useless_meter = roast_service.calculate_uselessness_score(therapy_response)
            
            response_data = {
                "session_id": session_id,
                "user_message": user_message,
                "therapy_response": therapy_response,
                "useless_meter": useless_meter,
                "timestamp": datetime.now().isoformat(),
                "therapist_mood": "professionally disappointed"
            }
            
            return jsonify({
                "success": True,
                "data": response_data,
                "message": "Response generated. Quality not guaranteed."
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Message processing failed: {str(e)}",
                "message": "Even the AI therapist gave up on you."
            }), 500
    
    # 🔥 ROASTING ENDPOINTS
    @app.route('/api/roast-me', methods=['POST'])
    def roast_me():
        """Get roasted by your therapist self"""
        
        try:
            data = request.get_json()
            roast_topic = data.get('topic', 'general_existence')
            intensity = data.get('intensity', 'medium')
            
            # Generate a roast based on topic
            roast_prompts = {
                'general_existence': "Roast me about my life choices in general",
                'work_life': "Roast me about my work and career decisions", 
                'relationships': "Roast me about my relationship skills",
                'self_care': "Roast me about my self-care routine",
                'decision_making': "Roast me about how I make decisions"
            }
            
            prompt = roast_prompts.get(roast_topic, "Just roast me about whatever")
            
            roast_response = roast_service.generate_therapy_response(prompt)
            useless_meter = roast_service.calculate_uselessness_score(roast_response)
            
            return jsonify({
                "success": True,
                "roast": roast_response,
                "topic": roast_topic,
                "intensity": intensity,
                "useless_meter": useless_meter,
                "disclaimer": "Roast provided by yourself. You asked for this.",
                "timestamp": datetime.now().isoformat()
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Roasting failed: {str(e)}",
                "message": "Couldn't even roast you properly. That's embarrassing."
            }), 500
    
    # 📊 AVATAR MANAGEMENT
    @app.route('/api/avatar/<avatar_id>', methods=['GET'])
    def get_avatar_info(avatar_id):
        """Get avatar information"""
        
        result = avatar_service.get_avatar_info(avatar_id)
        
        if result.get('error'):
            return jsonify(result), 404
        
        return jsonify(result)
    
    @app.route('/api/avatar/<avatar_id>/customize', methods=['POST'])
    def customize_avatar(avatar_id):
        """Customize avatar settings"""
        
        data = request.get_json()
        customizations = data.get('customizations', {})
        
        result = avatar_service.customize_avatar(avatar_id, customizations)
        
        if result.get('error'):
            return jsonify(result), 400
        
        return jsonify(result)
    
    @app.route('/api/avatar/<avatar_id>/video-preview', methods=['POST'])
    def generate_video_preview(avatar_id):
        """Generate avatar video preview"""
        
        result = avatar_service.generate_avatar_preview_video(avatar_id)
        
        return jsonify({
            "success": True,
            "data": result,
            "message": "Video preview generation started. Prepare for uncanny valley vibes."
        })
    
    # 📁 FILE SERVING
    @app.route('/api/files/<filename>')
    def serve_file(filename):
        """Serve uploaded or generated files"""
        
        # Check in uploads folder first
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(upload_path):
            return send_file(upload_path)
        
        # Check in avatars folder
        avatar_path = os.path.join(app.config['AVATAR_FOLDER'], filename)
        if os.path.exists(avatar_path):
            return send_file(avatar_path)
        
        return jsonify({
            "error": "File not found",
            "message": "The file has disappeared, much like your motivation for self-improvement."
        }), 404
    
    # 🎯 UTILITY ENDPOINTS
    @app.route('/api/therapy-modes', methods=['GET'])
    def get_therapy_modes():
        """Get available therapy modes"""
        
        return jsonify({
            "therapy_modes": [
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
            ],
            "default": "condescending"
        })
    
    @app.route('/api/uselessness-ratings', methods=['GET'])
    def get_uselessness_ratings():
        """Get the uselessness rating system explanation"""
        
        return jsonify({
            "rating_system": {
                "🔥 Maximum Uselessness Achieved": {
                    "score_range": "0.8 - 1.0",
                    "description": "Advice so bad it's performance art"
                },
                "🍕 Pizza-tier Advice": {
                    "score_range": "0.6 - 0.8", 
                    "description": "Barely qualifies as advice"
                },
                "🤷 Mildly Unhelpful": {
                    "score_range": "0.4 - 0.6",
                    "description": "Could be worse, but probably won't help"
                },
                "😴 Surprisingly Reasonable": {
                    "score_range": "0.0 - 0.4",
                    "description": "Accidentally helpful (system malfunction)"
                }
            },
            "factors": [
                "Number of therapy clichés used",
                "Rhetorical questions asked",
                "Level of sarcasm detected",
                "Amount of circular reasoning"
            ]
        })
    
    return app
