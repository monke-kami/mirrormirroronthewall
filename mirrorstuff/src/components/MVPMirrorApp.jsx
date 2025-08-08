import React, { useState, useRef, useCallback } from 'react';
import './MVPMirrorApp.css';

const API_BASE = 'http://localhost:8000';

const MVPMirrorApp = () => {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, upload, chat
  const [selfieData, setSelfieData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deepfakeVideo, setDeepfakeVideo] = useState(null);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const fileInputRef = useRef(null);

  // Upload selfie file
  const uploadSelfie = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE}/api/upload-selfie`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      setSelfieData({
        ...result,
        localUrl: URL.createObjectURL(file)
      });
      setCurrentStep('chat');
      
      // Add welcome message from AI
      setMessages([{
        id: 1,
        text: "Well, well, well... look who finally decided to face themselves. I'm your digital twin, and I'm here to give you the therapy you probably don't deserve. What's eating you up inside today?",
        isAi: true,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload from input
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadSelfie(file);
    }
  };

  // Send message to RoastGPT
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isAi: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: userId
        }),
      });
      
      const result = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        text: result.response,
        isAi: true,
        timestamp: new Date(),
        roastLevel: result.roast_level
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Generate deepfake for the latest AI response
      if (selfieData && result.response) {
        generateDeepfake(result.response);
      }
      
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Even the AI is speechless. That's... actually impressive.",
        isAi: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate deepfake video
  const generateDeepfake = async (text) => {
    if (!selfieData) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/generate-deepfake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: `${API_BASE}${selfieData.url}`,
          text: text
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Poll for completion
        pollDeepfakeStatus(result.talk_id);
      }
    } catch (error) {
      console.error('Deepfake generation failed:', error);
    }
  };

  // Poll deepfake status
  const pollDeepfakeStatus = async (talkId) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/deepfake-status/${talkId}`);
        const result = await response.json();
        
        if (result.status === 'done' && result.video_url) {
          setDeepfakeVideo(result.video_url);
        } else if (result.status === 'processing') {
          setTimeout(checkStatus, 3000); // Check again in 3 seconds
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    };
    
    checkStatus();
  };

  // Welcome screen
  if (currentStep === 'welcome') {
    return (
      <div className="mvp-container welcome-screen">
        <div className="welcome-content">
          <h1 className="mvp-title">
            🪞 Mirror Mirror MVP
          </h1>
          <p className="mvp-subtitle">
            Face your worst enemy: yourself. Upload a selfie and let your digital twin roast you with brutal honesty.
          </p>
          <div className="mvp-features">
            <div className="feature">📸 Selfie Upload</div>
            <div className="feature">🤖 GPT-4 Powered Roasts</div>
            <div className="feature">🎭 Deepfake Videos</div>
            <div className="feature">💀 Sarcastic Therapy</div>
          </div>
          <button
            onClick={() => setCurrentStep('upload')}
            className="mvp-cta-button"
          >
            <span>✨ Face Your Digital Twin</span>
          </button>
        </div>
      </div>
    );
  }

  // Upload screen
  if (currentStep === 'upload') {
    return (
      <div className="mvp-container upload-screen">
        <div className="upload-content">
          <h2 className="upload-title">Upload Your Selfie</h2>
          <p className="upload-subtitle">Choose your weapon... I mean, photo</p>
          
          <div 
            className="upload-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📸</div>
            <p className="upload-text">Click to upload or drag & drop</p>
            <p className="upload-subtext">JPG, PNG up to 10MB</p>
            {isLoading && (
              <div className="upload-loading">
                <div className="spinner"></div>
                <p>Processing your future nightmare...</p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="upload-input"
          />
        </div>
      </div>
    );
  }

  // Chat screen
  if (currentStep === 'chat') {
    return (
      <div className="mvp-container chat-screen">
        <div className="chat-layout">
          {/* Chat Interface */}
          <div className="chat-panel">
            <div className="chat-header">
              <h2>🤖 Therapy Session with Your Digital Twin</h2>
              <p>Prepare for brutal honesty</p>
            </div>
            
            {/* Messages */}
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.isAi ? 'message-ai' : 'message-user'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    {message.roastLevel && (
                      <div className="roast-level">
                        🔥 Roast Level: {message.roastLevel.toFixed(1)}/5.0
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message message-ai">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p>Crafting your personalized roast...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="chat-input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tell your digital twin about your problems..."
                className="chat-input"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="send-button"
              >
                ⚡
              </button>
            </div>
          </div>
          
          {/* Deepfake Video */}
          <div className="video-panel">
            <div className="video-header">
              <h3>🎭 Your Digital Twin</h3>
            </div>
            
            <div className="video-container">
              {deepfakeVideo ? (
                <video
                  src={deepfakeVideo}
                  autoPlay
                  loop
                  controls
                  className="deepfake-video"
                />
              ) : selfieData ? (
                <div className="selfie-container">
                  <img
                    src={selfieData.localUrl}
                    alt="Your selfie"
                    className="selfie-image"
                  />
                  <div className="video-overlay">
                    <div className="video-loading">
                      <div className="spinner"></div>
                      <p>Generating your digital twin...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="video-placeholder">
                  <p>Your digital twin will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MVPMirrorApp;
