import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

const Header = ({ currentStage }) => {
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const stages = [
    { id: 'upload', name: 'Upload Selfie', number: 1 },
    { id: 'generate', name: 'Generate Avatar', number: 2 },
    { id: 'therapy', name: 'Therapy Session', number: 3 }
  ];

  const getStageStatus = (stageId) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    const stageIndex = stages.findIndex(s => s.id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      padding: '1.5rem 2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>
          🤖🪞 Mirror Mirror on the Wall
        </h1>
        <p style={{ color: '#ecf0f1', fontStyle: 'italic', opacity: '0.9', fontSize: '1.1rem', marginBottom: '1rem' }}>
          "Because sometimes, the only person qualified to roast you... is also you."
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {stages.map((stage) => {
              const status = getStageStatus(stage.id);
              const isActive = status === 'active';
              const isCompleted = status === 'completed';
              
              return (
                <div 
                  key={stage.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : isCompleted ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.1)',
                    border: isActive ? '2px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#27ae60' : isActive ? '#e74c3c' : 'rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {isCompleted ? '✓' : stage.number}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{stage.name}</span>
                </div>
              );
            })}
          </div>

          {/* Authentication Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Welcome back, {user?.username}! 👋
                </span>
                <button
                  onClick={() => setShowProfile(true)}
                  style={{
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 10px rgba(78, 205, 196, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(78, 205, 196, 0.3)';
                  }}
                >
                  👤 Profile
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleAuthClick('login')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🔑 Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  style={{
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 10px rgba(78, 205, 196, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(78, 205, 196, 0.3)';
                  }}
                >
                  ✨ Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />

        {/* User Profile Modal */}
        <UserProfile 
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      </div>
    </header>
  );
};

export default Header;
