# Mirror Mirror Backend API

## Installation
```bash
npm install
```

## Start Server
```bash
npm start
```

## API Endpoints

### Register User
POST `http://localhost:5000/api/auth/register`
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### Login User
POST `http://localhost:5000/api/auth/login`
```json
{
  "username": "testuser", 
  "password": "password123"
}
```

### Get User Profile (Protected)
GET `http://localhost:5000/api/auth/profile`
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Notes
- MongoDB must be running on localhost:27017
- JWT tokens expire in 24 hours
- Passwords are hashed using bcrypt
