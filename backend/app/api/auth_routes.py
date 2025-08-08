"""
🔐 Authentication Routes for Mirror Mirror
Login, logout, and registration endpoints for therapeutic disappointment.

"Creating accounts faster than we destroy self-esteem!"
"""

from flask import request, jsonify
from app.services.auth_service import AuthService, token_required, optional_auth


def create_auth_routes(app):
    """Create authentication routes"""
    
    auth_service = AuthService()
    
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        """Register a new user"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'error': 'No data provided',
                    'message': 'Please provide registration details'
                }), 400
            
            username = data.get('username', '').strip()
            email = data.get('email', '').strip()
            password = data.get('password', '')
            
            if not all([username, email, password]):
                return jsonify({
                    'success': False,
                    'error': 'Missing required fields',
                    'message': 'Username, email, and password are required'
                }), 400
            
            success, message, result = auth_service.register_user(username, email, password)
            
            if success:
                return jsonify({
                    'success': True,
                    'message': message,
                    'data': result
                }), 201
            else:
                return jsonify({
                    'success': False,
                    'error': message,
                    'message': 'Registration failed'
                }), 400
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'An unexpected error occurred during registration'
            }), 500
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        """Login user"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'error': 'No data provided',
                    'message': 'Please provide login credentials'
                }), 400
            
            login_identifier = data.get('username') or data.get('email', '')
            password = data.get('password', '')
            
            if not all([login_identifier, password]):
                return jsonify({
                    'success': False,
                    'error': 'Missing credentials',
                    'message': 'Username/email and password are required'
                }), 400
            
            success, message, result = auth_service.login_user(login_identifier.strip(), password)
            
            if success:
                return jsonify({
                    'success': True,
                    'message': message,
                    'data': result
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': message,
                    'message': 'Login failed'
                }), 401
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'An unexpected error occurred during login'
            }), 500
    
    @app.route('/api/auth/verify', methods=['GET'])
    @token_required
    def verify_token(current_user):
        """Verify authentication token"""
        return jsonify({
            'success': True,
            'message': 'Token is valid',
            'data': {
                'user': current_user.to_dict(),
                'authenticated': True
            }
        }), 200
    
    @app.route('/api/auth/profile', methods=['GET'])
    @token_required
    def get_profile(current_user):
        """Get user profile"""
        return jsonify({
            'success': True,
            'data': current_user.to_dict(),
            'message': f"Here's your profile, {current_user.username}. Hope you like disappointment."
        }), 200
    
    @app.route('/api/auth/profile', methods=['PUT'])
    @token_required
    def update_profile(current_user):
        """Update user profile"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'error': 'No data provided',
                    'message': 'Please provide profile data to update'
                }), 400
            
            # Remove sensitive fields that shouldn't be updated via this endpoint
            sensitive_fields = ['user_id', 'username', 'email', 'password', 'created_at', 'last_login']
            profile_data = {k: v for k, v in data.items() if k not in sensitive_fields}
            
            success, message, result = auth_service.update_profile(current_user.user_id, profile_data)
            
            if success:
                return jsonify({
                    'success': True,
                    'message': message,
                    'data': result
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': message,
                    'message': 'Profile update failed'
                }), 400
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'An unexpected error occurred during profile update'
            }), 500
    
    @app.route('/api/auth/change-password', methods=['POST'])
    @token_required
    def change_password(current_user):
        """Change user password"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({
                    'success': False,
                    'error': 'No data provided',
                    'message': 'Please provide password change data'
                }), 400
            
            old_password = data.get('old_password', '')
            new_password = data.get('new_password', '')
            
            if not all([old_password, new_password]):
                return jsonify({
                    'success': False,
                    'error': 'Missing password data',
                    'message': 'Both old and new passwords are required'
                }), 400
            
            success, message = auth_service.change_password(
                current_user.user_id, old_password, new_password
            )
            
            if success:
                return jsonify({
                    'success': True,
                    'message': message
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': message,
                    'message': 'Password change failed'
                }), 400
                
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'An unexpected error occurred during password change'
            }), 500
    
    @app.route('/api/auth/logout', methods=['POST'])
    @token_required
    def logout(current_user):
        """Logout user (client-side token removal)"""
        return jsonify({
            'success': True,
            'message': f"Goodbye, {current_user.username}. Try not to miss the existential dread too much.",
            'data': {
                'logged_out': True,
                'user_id': current_user.user_id
            }
        }), 200
