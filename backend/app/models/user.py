"""
👤 User Model for Mirror Mirror Authentication
Because even fake therapy needs real users... unfortunately.

"Every user is special. Special in their own disappointing way."
"""

import json
import os
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from werkzeug.security import generate_password_hash, check_password_hash
import jwt


class User:
    """User model for authentication and profile management"""
    
    def __init__(self, user_id: str = None, username: str = None, email: str = None, 
                 password_hash: str = None, created_at: str = None, last_login: str = None,
                 profile_data: Dict = None):
        self.user_id = user_id or str(uuid.uuid4())
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at or datetime.now().isoformat()
        self.last_login = last_login
        self.profile_data = profile_data or {}
        
    def set_password(self, password: str):
        """Hash and set user password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.now().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary (excluding password)"""
        return {
            'user_id': self.user_id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'profile_data': self.profile_data
        }
    
    def generate_token(self, secret_key: str, expires_delta: timedelta = None) -> str:
        """Generate JWT token for user"""
        if expires_delta is None:
            expires_delta = timedelta(hours=24)
        
        payload = {
            'user_id': self.user_id,
            'username': self.username,
            'exp': datetime.utcnow() + expires_delta,
            'iat': datetime.utcnow()
        }
        
        return jwt.encode(payload, secret_key, algorithm='HS256')
    
    @staticmethod
    def verify_token(token: str, secret_key: str) -> Optional[Dict]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None


class UserDatabase:
    """Simple file-based user database (for development)"""
    
    def __init__(self, db_file: str = "./data/users.json"):
        self.db_file = db_file
        self._ensure_db_exists()
    
    def _ensure_db_exists(self):
        """Create database file if it doesn't exist"""
        os.makedirs(os.path.dirname(self.db_file), exist_ok=True)
        if not os.path.exists(self.db_file):
            with open(self.db_file, 'w') as f:
                json.dump({}, f)
    
    def _load_users(self) -> Dict[str, Dict]:
        """Load users from database file"""
        try:
            with open(self.db_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def _save_users(self, users: Dict[str, Dict]):
        """Save users to database file"""
        with open(self.db_file, 'w') as f:
            json.dump(users, f, indent=2)
    
    def create_user(self, username: str, email: str, password: str) -> Optional[User]:
        """Create a new user"""
        users = self._load_users()
        
        # Check if username or email already exists
        for user_data in users.values():
            if user_data['username'] == username:
                raise ValueError("Username already exists")
            if user_data['email'] == email:
                raise ValueError("Email already exists")
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        
        # Save to database
        users[user.user_id] = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'password_hash': user.password_hash,
            'created_at': user.created_at,
            'last_login': user.last_login,
            'profile_data': user.profile_data
        }
        
        self._save_users(users)
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        users = self._load_users()
        user_data = users.get(user_id)
        
        if user_data:
            return User(**user_data)
        return None
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        users = self._load_users()
        
        for user_data in users.values():
            if user_data['username'] == username:
                return User(**user_data)
        return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        users = self._load_users()
        
        for user_data in users.values():
            if user_data['email'] == email:
                return User(**user_data)
        return None
    
    def update_user(self, user: User):
        """Update user in database"""
        users = self._load_users()
        users[user.user_id] = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'password_hash': user.password_hash,
            'created_at': user.created_at,
            'last_login': user.last_login,
            'profile_data': user.profile_data
        }
        self._save_users(users)
    
    def delete_user(self, user_id: str) -> bool:
        """Delete user from database"""
        users = self._load_users()
        if user_id in users:
            del users[user_id]
            self._save_users(users)
            return True
        return False
    
    def get_all_users(self) -> Dict[str, User]:
        """Get all users"""
        users = self._load_users()
        return {user_id: User(**user_data) for user_id, user_data in users.items()}
