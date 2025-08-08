/**
 * 🔐 Authentication Modal
 * Login and registration modal for therapeutic authentication
 * 
 * "Log in to unlock premium disappointment features!"
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'register') {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!formData.username.trim() && !formData.email.trim()) {
        newErrors.username = 'Username or email is required';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'register' && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let result;
      
      if (mode === 'register') {
        result = await register(formData.username, formData.email, formData.password);
      } else {
        const loginIdentifier = formData.username || formData.email;
        result = await login(loginIdentifier, formData.password);
      }

      if (result.success) {
        // Reset form and close modal
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        onClose();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <h2>
            {mode === 'login' ? '🔑 Welcome Back!' : '✨ Join the Therapy'}
          </h2>
          <p>
            {mode === 'login' 
              ? "Ready for more existential dread?" 
              : "Sign up for professional-grade disappointment!"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose your therapy username"
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor={mode === 'register' ? 'email' : 'loginField'}>
              {mode === 'register' ? 'Email' : 'Username or Email'}
            </label>
            <input
              type={mode === 'register' ? 'email' : 'text'}
              id={mode === 'register' ? 'email' : 'loginField'}
              name={mode === 'register' ? 'email' : 'username'}
              value={mode === 'register' ? formData.email : formData.username}
              onChange={handleInputChange}
              placeholder={mode === 'register' ? 'your@email.com' : 'Username or email'}
              className={errors.email || errors.username ? 'error' : ''}
            />
            {(errors.email || errors.username) && (
              <span className="error-message">{errors.email || errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? '⏳ Processing...' 
              : mode === 'login' 
                ? '🚪 Log In' 
                : '🎭 Create Account'
            }
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {mode === 'login' 
              ? "New to therapeutic disappointment? " 
              : "Already have an account? "
            }
            <button 
              type="button" 
              className="auth-switch-btn"
              onClick={switchMode}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        <div className="auth-disclaimer">
          <small>
            🤖 By continuing, you agree to receive questionable advice and therapeutic roasting. 
            Not actual therapy. Please consult real professionals for real problems.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
