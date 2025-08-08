import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, Zap, MessageCircle, Video, Sparkles } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, upload, chat, deepfake
  const [selfieData, setSelfieData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deepfakeVideo, setDeepfakeVideo] = useState(null);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Capture selfie from webcam
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          uploadSelfie(file);
        });
    }
  }, [webcamRef]);

  // Upload selfie file
  const uploadSelfie = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE}/api/upload-selfie`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSelfieData({
        ...response.data,
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
      const response = await axios.post(`${API_BASE}/api/chat`, {
        message: inputMessage,
        user_id: userId
      });
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isAi: true,
        timestamp: new Date(),
        roastLevel: response.data.roast_level
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Generate deepfake for the latest AI response
      if (selfieData && response.data.response) {
        generateDeepfake(response.data.response);
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
      const response = await axios.post(`${API_BASE}/api/generate-deepfake`, {
        image_url: `${API_BASE}${selfieData.url}`,
        text: text
      });
      
      if (response.data.success) {
        // Poll for completion
        pollDeepfakeStatus(response.data.talk_id);
      }
    } catch (error) {
      console.error('Deepfake generation failed:', error);
    }
  };

  // Poll deepfake status
  const pollDeepfakeStatus = async (talkId) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/deepfake-status/${talkId}`);
        
        if (response.data.status === 'done' && response.data.video_url) {
          setDeepfakeVideo(response.data.video_url);
        } else if (response.data.status === 'processing') {
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold mb-6 neon-text animate-pulse-neon">
            Mirror Mirror
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Meet your worst enemy: yourself. Upload a selfie and let your digital twin roast you with brutal honesty.
          </p>
          <button
            onClick={() => setCurrentStep('upload')}
            className="bg-gradient-to-r from-neon-cyan to-neon-pink text-black px-8 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-3 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            Face Your Digital Twin
          </button>
        </div>
      </div>
    );
  }

  // Upload screen
  if (currentStep === 'upload') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center neon-text">
            Upload Your Selfie
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Webcam */}
            <div className="text-center">
              <h3 className="text-xl mb-4">Take a Photo</h3>
              <div className="neon-border rounded-lg overflow-hidden mb-4">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-64 object-cover"
                />
              </div>
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="bg-neon-cyan text-black px-6 py-3 rounded-lg font-bold hover:bg-opacity-80 transition-all flex items-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                {isLoading ? 'Processing...' : 'Capture'}
              </button>
            </div>
            
            {/* File Upload */}
            <div className="text-center">
              <h3 className="text-xl mb-4">Upload a File</h3>
              <div 
                className="upload-zone cursor-pointer h-64 flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mb-4 text-neon-cyan" />
                <p>Click to upload or drag & drop</p>
                <p className="text-sm text-gray-400 mt-2">JPG, PNG up to 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat screen
  if (currentStep === 'chat') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 h-screen">
          {/* Chat Interface */}
          <div className="flex flex-col">
            <div className="glass-card p-6 mb-4">
              <h2 className="text-2xl font-bold neon-text flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Therapy Session with Your Digital Twin
              </h2>
            </div>
            
            {/* Messages */}
            <div className="flex-1 glass-card p-4 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={message.isAi ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                    <p>{message.text}</p>
                    {message.roastLevel && (
                      <div className="text-xs mt-1 opacity-75">
                        Roast Level: {message.roastLevel.toFixed(1)}/5.0
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai">
                    <div className="animate-pulse">Crafting your roast...</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tell your digital twin about your problems..."
                className="flex-1 bg-white bg-opacity-10 border border-neon-cyan border-opacity-50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-opacity-100"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-neon-pink text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-80 transition-all disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Deepfake Video */}
          <div className="flex flex-col">
            <div className="glass-card p-6 mb-4">
              <h3 className="text-xl font-bold neon-text flex items-center gap-2">
                <Video className="w-5 h-5" />
                Your Digital Twin
              </h3>
            </div>
            
            <div className="flex-1 glass-card p-4">
              {deepfakeVideo ? (
                <div className="deepfake-container p-2">
                  <video
                    src={deepfakeVideo}
                    autoPlay
                    loop
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : selfieData ? (
                <div className="neon-border rounded-lg overflow-hidden">
                  <img
                    src={selfieData.localUrl}
                    alt="Your selfie"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p>Generating your digital twin...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
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
}

export default App;
