"""
🔐 Authentication Service for Mirror Mirror
Because even fake therapy needs real security... sort of.

"Protecting your deepest insecurities since 2025."
"""

from typing import Optional, Dict, Any, Tuple
from functools import wraps
from flask import request, jsonify, current_app
import re
from datetime import datetime, timedelta

from app.models.user import User, UserDatabase


class AuthService:
    """Authentication service for user management"""
    
    def __init__(self):
        self.user_db = UserDatabase()
        self.email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        return bool(self.email_pattern.match(email))
    
    def validate_password(self, password: str) -> Tuple[bool, str]:
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r'[A-Za-z]', password):
            return False, "Password must contain at least one letter"
        
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        
        return True, "Password is valid"
    
    def validate_username(self, username: str) -> Tuple[bool, str]:
        """Validate username format"""
        if len(username) < 3:
            return False, "Username must be at least 3 characters long"
        
        if len(username) > 30:
            return False, "Username must be less than 30 characters"
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "Username can only contain letters, numbers, and underscores"
        
        return True, "Username is valid"
    
    def register_user(self, username: str, email: str, password: str) -> Tuple[bool, str, Optional[Dict]]:
        """Register a new user"""
        try:
            # Validate input
            username_valid, username_msg = self.validate_username(username)
            if not username_valid:
                return False, username_msg, None
            
            if not self.validate_email(email):
                return False, "Invalid email format", None
            
            password_valid, password_msg = self.validate_password(password)
            if not password_valid:
                return False, password_msg, None
            
            # Create user
            user = self.user_db.create_user(username, email, password)
            
            # Generate token
            token = user.generate_token(current_app.config['SECRET_KEY'])
            
            return True, "User registered successfully", {
                'user': user.to_dict(),
                'token': token,
                'message': f"Welcome to Mirror Mirror, {username}! Prepare for disappointment."
            }
            
        except ValueError as e:
            return False, str(e), None
        except Exception as e:
            return False, f"Registration failed: {str(e)}", None
    
    def login_user(self, login_identifier: str, password: str) -> Tuple[bool, str, Optional[Dict]]:
        """Login user with username/email and password"""
        try:
            # Find user by username or email
            user = None
            if self.validate_email(login_identifier):
                user = self.user_db.get_user_by_email(login_identifier)
            else:
                user = self.user_db.get_user_by_username(login_identifier)
            
            if not user:
                return False, "Invalid credentials", None
            
            # Check password
            if not user.check_password(password):
                return False, "Invalid credentials", None
            
            # Update last login
            user.update_last_login()
            self.user_db.update_user(user)
            
            # Generate token
            token = user.generate_token(current_app.config['SECRET_KEY'])
            
            return True, "Login successful", {
                'user': user.to_dict(),
                'token': token,
                'message': f"Welcome back, {user.username}! Ready for more existential dread?"
            }
            
        except Exception as e:
            return False, f"Login failed: {str(e)}", None
    
    def verify_token(self, token: str) -> Optional[User]:
        """Verify JWT token and return user"""
        try:
            payload = User.verify_token(token, current_app.config['SECRET_KEY'])
            if payload:
                user = self.user_db.get_user_by_id(payload['user_id'])
                return user
            return None
        except Exception:
            return None
    
    def get_current_user(self, request) -> Optional[User]:
        """Get current user from request"""
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        try:
            # Extract token from "Bearer <token>"
            token = auth_header.split(' ')[1]
            return self.verify_token(token)
        except (IndexError, AttributeError):
            return None
    
    def change_password(self, user_id: str, old_password: str, new_password: str) -> Tuple[bool, str]:
        """Change user password"""
        try:
            user = self.user_db.get_user_by_id(user_id)
            if not user:
                return False, "User not found"
            
            # Verify old password
            if not user.check_password(old_password):
                return False, "Invalid current password"
            
            # Validate new password
            password_valid, password_msg = self.validate_password(new_password)
            if not password_valid:
                return False, password_msg
            
            # Update password
            user.set_password(new_password)
            self.user_db.update_user(user)
            
            return True, "Password changed successfully"
            
        except Exception as e:
            return False, f"Password change failed: {str(e)}"
    
    def update_profile(self, user_id: str, profile_data: Dict) -> Tuple[bool, str, Optional[Dict]]:
        """Update user profile data"""
        try:
            user = self.user_db.get_user_by_id(user_id)
            if not user:
                return False, "User not found", None
            
            # Update profile data
            user.profile_data.update(profile_data)
            self.user_db.update_user(user)
            
            return True, "Profile updated successfully", user.to_dict()
            
        except Exception as e:
            return False, f"Profile update failed: {str(e)}", None


def token_required(f):
    """Decorator to require authentication token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_service = AuthService()
        user = auth_service.get_current_user(request)
        
        if not user:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Please log in to access this feature. Even fake therapy has standards.',
                'status': 'unauthorized'
            }), 401
        
        return f(current_user=user, *args, **kwargs)
    
    return decorated


def optional_auth(f):
    """Decorator for optional authentication (user can be None)"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_service = AuthService()
        user = auth_service.get_current_user(request)
        return f(current_user=user, *args, **kwargs)
    
    return decorated
