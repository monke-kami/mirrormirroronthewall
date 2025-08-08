/**
 * 👤 User Profile Component
 * Display and manage user profile information
 * 
 * "Managing your profile... and your disappointment since 2025!"
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile, authService } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.profile_data?.bio || '',
    therapyStyle: user?.profile_data?.therapy_style || 'roast_therapy',
    roastLevel: user?.profile_data?.roast_level || 'medium_rare',
    notifications: user?.profile_data?.notifications || true
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Profile updated successfully! 🎉');
        setIsEditing(false);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccess('');

    try {
      const result = await authService.changePassword(
        passwordData.oldPassword, 
        passwordData.newPassword
      );
      
      if (result.success) {
        setSuccess('Password changed successfully! 🔒');
        setIsChangingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Failed to change password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-join-date">
              Joined {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="profile-content">
          {!isChangingPassword ? (
            <div className="profile-section">
              <div className="section-header">
                <h3>Profile Information</h3>
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? '❌ Cancel' : '✏️ Edit'}
                </button>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your therapeutic journey..."
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="therapyStyle">Therapy Style</label>
                    <select
                      id="therapyStyle"
                      name="therapyStyle"
                      value={formData.therapyStyle}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="roast_therapy">🔥 Roast Therapy</option>
                      <option value="gentle_nudging">🤲 Gentle Nudging</option>
                      <option value="brutal_honesty">💀 Brutal Honesty</option>
                      <option value="comedic_relief">😂 Comedic Relief</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="roastLevel">Roast Level</label>
                    <select
                      id="roastLevel"
                      name="roastLevel"
                      value={formData.roastLevel}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="rare">🥩 Rare (Gentle)</option>
                      <option value="medium_rare">🍖 Medium Rare</option>
                      <option value="well_done">🔥 Well Done (Crispy)</option>
                      <option value="charcoal">⚫ Charcoal (Brutal)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <span className="checkmark"></span>
                    Enable therapeutic notifications
                  </label>
                </div>

                {isEditing && (
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="profile-section">
              <div className="section-header">
                <h3>Change Password</h3>
                <button 
                  className="edit-btn"
                  onClick={() => setIsChangingPassword(false)}
                >
                  ❌ Cancel
                </button>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label htmlFor="oldPassword">Current Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="At least 8 characters"
                    className={errors.newPassword ? 'error' : ''}
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '⏳ Changing...' : '🔒 Change Password'}
                </button>
              </form>
            </div>
          )}

          <div className="profile-actions">
            {!isChangingPassword && !isEditing && (
              <button 
                className="password-btn"
                onClick={() => setIsChangingPassword(true)}
              >
                🔑 Change Password
              </button>
            )}
            
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
