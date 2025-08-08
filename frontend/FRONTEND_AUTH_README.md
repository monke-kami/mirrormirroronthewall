# 🔐 Frontend Authentication Integration

Welcome to the freshly authenticated Mirror Mirror frontend! Now with 100% more user management and 0% more actual therapy credentials.

## 🎭 What's New

### Authentication Features
- **Login/Register Modals** - Beautiful, themed authentication
- **User Profile Management** - Update preferences and change passwords
- **Protected Routes** - Some features require login (coming soon)
- **Persistent Sessions** - Stay logged in with JWT tokens
- **Therapeutic Error Messages** - Even errors get therapy!

### Components Added

#### 🔐 AuthModal (`src/components/AuthModal.jsx`)
- Handles both login and registration
- Real-time validation with therapeutic sass
- Smooth animations and transitions
- Responsive design for mobile therapy

#### 👤 UserProfile (`src/components/UserProfile.jsx`)
- Profile management and editing
- Password change functionality
- Therapy preference settings
- Logout functionality

#### 🎪 Enhanced Header (`src/components/Header.jsx`)
- Login/Register buttons for guests
- User welcome message and profile access for authenticated users
- Seamless integration with existing progress tracker

### Services & Context

#### 🔧 AuthService (`src/services/authService.js`)
- Complete authentication API integration
- Automatic token management
- Axios interceptors for seamless auth
- Local storage persistence

#### 🌐 AuthContext (`src/contexts/AuthContext.jsx`)
- React context for global auth state
- Hooks for easy authentication access
- Loading states and error handling

## 🚀 How to Use

### 1. User Registration
```jsx
// Users can register with username, email, and password
// Validation includes:
// - Username: 3+ characters, alphanumeric + underscore
// - Email: Valid email format
// - Password: 8+ characters with letter and number
```

### 2. User Login
```jsx
// Users can login with either username or email
// JWT tokens automatically included in API calls
// Persistent sessions across browser refreshes
```

### 3. Profile Management
```jsx
// Authenticated users can:
// - Update bio and therapy preferences
// - Change therapy style (roast, gentle, brutal, comedic)
// - Set roast level (rare to charcoal)
// - Change password
// - Logout
```

### 4. Integration with Existing Features
```jsx
// Current features now support authentication:
// - Selfie upload tracks user (if logged in)
// - Avatar generation can be saved to user account
// - Therapy sessions can be personalized
```

## 🎨 Styling

All authentication components use the app's existing color scheme:
- **Primary**: Linear gradients with blues and teals
- **Accent**: `#4ecdc4` (teal) for buttons and highlights
- **Background**: Dark gradients for modals
- **Typography**: Consistent with app theme

## 🔧 Technical Implementation

### Authentication Flow
1. User clicks Login/Register in header
2. Modal opens with appropriate form
3. Form submission calls AuthService
4. On success, JWT stored in localStorage
5. AuthContext updates app state
6. Header shows user info and profile button

### State Management
```jsx
// AuthContext provides:
const {
  user,              // Current user object
  isAuthenticated,   // Boolean auth status
  isLoading,         // Loading state
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  updateProfile,     // Profile update function
  authService        // Direct service access
} = useAuth();
```

### API Integration
```jsx
// Automatic token inclusion in requests
axios.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic logout on 401 responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎯 Usage Examples

### Using Authentication in Components
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome back, {user.username}!</p>
      ) : (
        <p>Please log in for premium disappointment</p>
      )}
    </div>
  );
}
```

### Protected Features
```jsx
function ProtectedFeature() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in to access this feature</div>;
  }
  
  return <div>Secret therapeutic content</div>;
}
```

## 🔄 Integration with Backend

### API Endpoints Used
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Enhanced Existing Endpoints
- `POST /api/upload-selfie` - Now includes user info if authenticated
- WebSocket therapy sessions - Can include user context

## 🎭 Therapeutic Features

### Profile Customization
Users can set their therapy preferences:
- **Therapy Style**: Roast, Gentle, Brutal, or Comedic
- **Roast Level**: From Rare (gentle) to Charcoal (brutal)
- **Bio**: Personal therapeutic journey description
- **Notifications**: Enable/disable therapeutic reminders

### Error Messages
All error messages maintain the app's therapeutic tone:
- "Not even your own app recognizes you" (invalid login)
- "Your password is as weak as your commitment to therapy" (weak password)
- "Even our registration process is disappointed in you" (registration error)

## 🔮 Future Enhancements

- [ ] **Therapy Session History** - Save and review past sessions
- [ ] **Avatar Gallery** - Save generated avatars to profile
- [ ] **Sharing Features** - Share therapeutic insights
- [ ] **Progress Tracking** - Monitor therapeutic journey
- [ ] **Social Features** - Connect with other therapy seekers
- [ ] **OAuth Integration** - Google/GitHub login
- [ ] **Email Verification** - Verify email addresses
- [ ] **Password Reset** - Email-based password recovery

## 🤝 Development Notes

### Adding Protected Routes
To add authentication requirements to new features:

1. **Optional Authentication** (works with/without login):
```jsx
import { useAuth } from '../contexts/AuthContext';

function OptionalAuthFeature() {
  const { user, isAuthenticated } = useAuth();
  
  // Enhanced experience for logged-in users
  // Basic experience for guests
}
```

2. **Required Authentication** (login required):
```jsx
function RequiredAuthFeature() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <ProtectedContent />;
}
```

### Customizing User Experience
The authentication system tracks user preferences and can customize:
- Therapy response style
- Roast intensity level
- UI themes (future)
- Notification preferences

### Extending User Data
To add new user profile fields:

1. Update backend `User` model
2. Add fields to `UserProfile.jsx` form
3. Update API endpoints as needed
4. Maintain backward compatibility

## 🎉 Getting Started

1. **Start the backend** (with authentication enabled):
   ```bash
   cd backend
   pip install PyJWT bcrypt  # New dependencies
   python app.py
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm install  # Dependencies already included
   npm run dev
   ```

3. **Test authentication**:
   - Click "Sign Up" in header
   - Create account with username, email, password
   - Login and explore profile features
   - Try uploading selfies while logged in

## 🤖 Remember

This is still not actual therapy, but now it's not actual therapy *with user accounts*! 

For real mental health support, please consult licensed professionals. For fake digital therapy with persistent user sessions, you're in the right place! 🎭✨
