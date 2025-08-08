import { useState } from 'react';
import './DeepfakeTherapist.css';
import AvatarUpload from './AvatarUpload';
import TherapistSelector from './TherapistSelector';
import TherapySession from './TherapySession';

const DeepfakeTherapist = ({ authenticatedUser }) => {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'select', 'session'
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('zen');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAvatarUploaded = (avatar) => {
    setUploadedAvatar(avatar);
    setCurrentStep('select');
  };

  const handleStyleSelected = (style) => {
    setSelectedStyle(style);
  };

  const startTherapySession = async () => {
    if (!uploadedAvatar || !selectedStyle) return;

    setIsProcessing(true);
    
    try {
      // Try backend first, fallback to mock processing
      try {
        const response = await fetch(`http://localhost:5000/api/avatars/process/${uploadedAvatar.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ style: selectedStyle }),
        });

        if (response.ok) {
          setTimeout(() => {
            setIsProcessing(false);
            setCurrentStep('session');
          }, 3000); // Simulate processing time
          return;
        } else {
          throw new Error('Backend processing failed');
        }
      } catch (backendError) {
        console.warn('Backend processing failed, using fallback:', backendError);
        
        // Fallback: Just simulate processing without backend
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep('session');
        }, 3000); // Simulate processing time
      }
    } catch (error) {
      console.error('Failed to process avatar:', error);
      setIsProcessing(false);
      alert('Failed to create your digital therapist. Try again!');
    }
  };

  const endSession = () => {
    setCurrentStep('upload');
    setUploadedAvatar(null);
    setSelectedStyle('zen');
  };

  const resetToUpload = () => {
    setCurrentStep('upload');
    setUploadedAvatar(null);
    setSelectedStyle('zen');
  };

  if (isProcessing) {
    return (
      <div className="deepfake-therapist processing">
        <div className="processing-container">
          <div className="processing-avatar">
            <div className="avatar-image">🤖</div>
            <div className="processing-effects">
              <div className="effect-ring ring-1"></div>
              <div className="effect-ring ring-2"></div>
              <div className="effect-ring ring-3"></div>
            </div>
          </div>
          <h2>Creating Your Digital Twin...</h2>
          <div className="processing-steps">
            <div className="step active">📸 Analyzing your face</div>
            <div className="step active">🧠 Mapping your personality disorders</div>
            <div className="step active">💭 Generating unhelpful responses</div>
            <div className="step">✨ Finalizing your worst self</div>
          </div>
          <div className="processing-bar">
            <div className="progress-fill"></div>
          </div>
          <p>This might take a moment... we're making sure you'll hate yourself properly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deepfake-therapist">
      <div className="app-header">
        <h1>🤖🪞 Fake Deepfake Therapist</h1>
        <p>Because sometimes, the only person qualified to roast you... is also you.</p>
        {authenticatedUser && (
          <div className="user-info">
            <span>Logged in as: Dr. {authenticatedUser.username}</span>
          </div>
        )}
        
        {currentStep !== 'upload' && (
          <button className="reset-btn" onClick={resetToUpload}>
            Start Over
          </button>
        )}
      </div>

      {currentStep === 'upload' && (
        <div className="step-container">
          <div className="step-header">
            <h2>Step 1: Upload Your Selfie</h2>
            <p>Let's create your worst nightmare... yourself as a therapist</p>
          </div>
          <AvatarUpload onAvatarUploaded={handleAvatarUploaded} />
        </div>
      )}

      {currentStep === 'select' && (
        <div className="step-container">
          <div className="step-header">
            <h2>Step 2: Choose Your Therapy Style</h2>
            <p>Pick how you'd like to be emotionally damaged today</p>
          </div>
          <TherapistSelector 
            onStyleSelected={handleStyleSelected}
            selectedStyle={selectedStyle}
          />
          <div className="step-actions">
            <button 
              className="continue-btn"
              onClick={startTherapySession}
              disabled={!selectedStyle}
            >
              Begin Therapy Session
            </button>
          </div>
        </div>
      )}

      {currentStep === 'session' && (
        <div className="session-container">
          <TherapySession 
            avatarStyle={selectedStyle}
            onEndSession={endSession}
            avatarData={uploadedAvatar}
            username={authenticatedUser?.username || 'Anonymous'}
          />
        </div>
      )}

      <div className="app-footer">
        <p>
          <small>
            ⚠️ Disclaimer: This is satire. For real therapy, consult actual professionals. 
            This app is designed to be unhelpful and should not replace genuine mental health support.
          </small>
        </p>
      </div>
    </div>
  );
};

export default DeepfakeTherapist;
