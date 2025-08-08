# 🔐 Mirror Mirror Authentication System

Welcome to the authentication backend for Mirror Mirror on the Wall - where even login requires therapy!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
SECRET_KEY=your_super_secret_key_here
DEBUG=True
DATA_FOLDER=./data
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": "uuid-here",
      "username": "your_username",
      "email": "your_email@example.com",
      "created_at": "2025-08-08T12:00:00.000Z",
      "profile_data": {}
    },
    "token": "jwt-token-here",
    "message": "Welcome to Mirror Mirror, your_username! Prepare for disappointment."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",  // or use "email"
  "password": "your_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt-token-here",
    "message": "Welcome back, your_username! Ready for more existential dread?"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer your-jwt-token
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer your-jwt-token
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "bio": "Just seeking therapeutic disappointment",
  "preferences": {
    "therapy_style": "brutal_honesty",
    "roast_level": "medium_rare"
  }
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "old_password": "current_password",
  "new_password": "new_password123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer your-jwt-token
```

## 🛡️ Security Features

### Password Requirements
- Minimum 8 characters
- Must contain at least one letter
- Must contain at least one number

### Username Requirements
- 3-30 characters
- Letters, numbers, and underscores only

### JWT Tokens
- 24-hour expiration by default
- HS256 algorithm
- Include user ID and username in payload

## 🧪 Testing

Run the authentication test script:
```bash
python test_auth.py
```

This will test:
- User registration
- User login
- Token verification
- Profile access
- Profile updates

## 🗄️ Database

Currently uses a simple JSON file-based database for development:
- File: `./data/users.json`
- Auto-creates on first use
- Stores hashed passwords (bcrypt)

### User Data Structure
```json
{
  "user_id": {
    "user_id": "uuid",
    "username": "string",
    "email": "string",
    "password_hash": "bcrypt_hash",
    "created_at": "iso_timestamp",
    "last_login": "iso_timestamp",
    "profile_data": {
      "bio": "string",
      "preferences": {},
      "custom_fields": "any"
    }
  }
}
```

## 🔄 Integration with Existing Routes

Authentication is integrated with existing routes:

### Optional Authentication
Routes that work with or without login:
- `POST /api/upload-selfie` - Tracks user if logged in
- `POST /api/generate-avatar` - Associates with user account
- WebSocket therapy sessions - Can persist user data

### Required Authentication
Routes that require login:
- Profile management
- Saved therapy sessions
- Avatar galleries (future feature)
- User preferences

## 🚨 Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "error": "specific_error_message",
  "message": "user_friendly_message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (registration)
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `404` - Not found
- `500` - Server error

## 🔧 Development Notes

### Adding Authentication to New Routes

**Optional Authentication:**
```python
from app.services.auth_service import optional_auth

@app.route('/api/your-route', methods=['POST'])
@optional_auth
def your_route(current_user):
    # current_user will be None if not authenticated
    if current_user:
        # Do something with authenticated user
        pass
    # Handle both authenticated and guest users
```

**Required Authentication:**
```python
from app.services.auth_service import token_required

@app.route('/api/protected-route', methods=['GET'])
@token_required
def protected_route(current_user):
    # current_user is guaranteed to be valid User object
    return jsonify({'user_id': current_user.user_id})
```

### Customizing User Model

The `User` class in `app/models/user.py` can be extended:
```python
class User:
    def add_therapy_session(self, session_data):
        if 'therapy_sessions' not in self.profile_data:
            self.profile_data['therapy_sessions'] = []
        self.profile_data['therapy_sessions'].append(session_data)
```

## 🔮 Future Enhancements

- [ ] Real database integration (PostgreSQL/MySQL)
- [ ] OAuth integration (Google, GitHub)
- [ ] Password reset via email
- [ ] User avatar uploads
- [ ] Therapy session history
- [ ] User preferences for therapy style
- [ ] Admin user management
- [ ] Rate limiting for auth endpoints
- [ ] Multi-factor authentication

## 💡 Therapeutic Error Messages

Because even our error messages need therapy:

- Registration failed: "Even our registration process is disappointed in you"
- Invalid credentials: "Not even your own app recognizes you"
- Token expired: "Your session expired faster than your last relationship"
- Password too weak: "Your password is as weak as your commitment to therapy"

## 🤝 Contributing

When adding new authentication features:
1. Follow the existing error message style (therapeutic sass)
2. Add appropriate tests to `test_auth.py`
3. Update this README
4. Ensure backward compatibility

Remember: We're building a therapy app, so even the code should be therapeutic! 🤖🪞
