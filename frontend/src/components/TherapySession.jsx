import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const TherapySession = ({ avatar, therapyMode, onBack, onStartOver, setError }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStats, setSessionStats] = useState(null);
  const [uselessnessAverage, setUselessnessAverage] = useState(0);
  
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    startTherapySession();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Calculate average uselessness
    const uselessScores = messages
      .filter(msg => msg.type === 'therapist' && msg.uselessMeter)
      .map(msg => msg.uselessMeter.score);
    
    if (uselessScores.length > 0) {
      const avg = uselessScores.reduce((a, b) => a + b, 0) / uselessScores.length;
      setUselessnessAverage(avg);
    }
  }, [messages]);

  const startTherapySession = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/therapy-session`, {
        avatar_id: avatar.avatar_id,
        session_type: 'chat'
      });

      if (response.data.success) {
        setSessionId(response.data.data.session_id);
        
        // Add welcome message
        const welcomeMsg = {
          id: Date.now(),
          type: 'therapist',
          content: response.data.data.response,
          timestamp: new Date().toISOString(),
          uselessMeter: { 
            score: response.data.data.useless_meter / 100, 
            rating: response.data.data.useless_meter > 90 ? '💀 Absolutely Useless' : 
                   response.data.data.useless_meter > 80 ? '🔥 Wildly Unhelpful' : 
                   '🤷 Mildly Disappointing'
          }
        };
        
        setMessages([welcomeMsg]);
        setIsConnected(true);
      } else {
        setError('Failed to start therapy session');
      }
    } catch (error) {
      console.error('Session start error:', error);
      setError('Could not connect to your therapist self. How fitting.');
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/therapy-session`, {
        avatar_id: avatar.avatar_id,
        message: messageToSend,
        session_id: sessionId
      });

      if (response.data.success) {
        const therapistMessage = {
          id: Date.now() + 1,
          type: 'therapist',
          content: response.data.data.response,
          timestamp: response.data.data.timestamp,
          uselessMeter: { 
            score: response.data.data.useless_meter / 100, 
            rating: response.data.data.useless_meter > 90 ? '💀 Absolutely Useless' : 
                   response.data.data.useless_meter > 80 ? '🔥 Wildly Unhelpful' : 
                   '🤷 Mildly Disappointing'
          }
        };

        setMessages(prev => [...prev, therapistMessage]);
      } else {
        setError('Failed to get therapy response');
      }
    } catch (error) {
      console.error('Message error:', error);
      setError('Your therapist self is not responding. Probably avoiding you.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const UselessnessMeter = ({ score, rating }) => (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '0.75rem',
      marginTop: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Uselessness Meter</span>
        <span style={{ fontSize: '0.8rem' }}>{rating}</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        overflow: 'hidden',
        margin: '0.5rem 0'
      }}>
        <div 
          style={{ 
            width: `${score * 100}%`,
            height: '100%',
            backgroundColor: score > 0.8 ? '#dc3545' : score > 0.6 ? '#fd7e14' : score > 0.4 ? '#ffc107' : '#28a745',
            transition: 'width 0.3s ease'
          }}
        ></div>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#666' }}>
        Score: {(score * 100).toFixed(0)}% useless
      </div>
    </div>
  );

  return (
    <div>
      {/* Session Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '0.5rem' }}>
            🛋️ Therapy Session with Yourself
          </h2>
          <p style={{ color: '#7f8c8d', fontSize: '1rem' }}>
            Your avatar: <strong>{avatar?.avatar_filename || 'Professional Disappointment'}</strong> • 
            Therapy Style: <strong>{therapyMode}</strong>
          </p>
        </div>

        {/* Session Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>📊 Session Stats</h4>
            <p><strong>Messages:</strong> {messages.length}</p>
            <p><strong>Avg. Uselessness:</strong> {(uselessnessAverage * 100).toFixed(0)}%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🎭 Therapist Info</h4>
            <p><strong>Specialty:</strong> Professional Disappointment</p>
            <p><strong>Success Rate:</strong> 2% (Mostly by accident)</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#ecf0f1', borderRadius: '8px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>💭 Current Mood</h4>
            <p><strong>Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            <p><strong>Catchphrase:</strong> "Have you tried not being yourself?"</p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* User Side */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>👤 You (The Patient)</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <p>Your camera would go here</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              (Webcam integration coming soon)
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={onBack}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#7f8c8d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              ← Back to Avatar
            </button>
            <button 
              onClick={onStartOver} 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginLeft: '0.5rem'
              }}
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Therapist Side */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🤖 Dr. You (The "Therapist")</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍⚕️</div>
              <p>Avatar video would play here</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                (Deepfake video coming soon)
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#7f8c8d' }}>
            <strong>Qualifications:</strong>
            <div>• PhD in Making Things Worse</div>
            <div>• Certified Life Ruiner</div>
            <div>• Master's in Disappointment</div>
            <div>• Licensed to Confuse</div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '2px solid #e0e0e0'
      }}>
        <h3>💬 Chat with Your Therapist Self</h3>
        
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#f9f9f9'
        }} ref={chatContainerRef}>
          {messages.map((message) => (
            <div key={message.id} style={{
              padding: '0.75rem',
              margin: '0.5rem 0',
              borderRadius: '8px',
              backgroundColor: message.type === 'user' ? '#e3f2fd' : '#f3e5f5',
              borderLeft: `4px solid ${message.type === 'user' ? '#2196f3' : '#9c27b0'}`
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>
                  {message.type === 'user' ? '👤 You' : '🤖 Dr. You'}
                </strong>
                <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '1rem' }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>{message.content}</div>
              {message.uselessMeter && (
                <UselessnessMeter 
                  score={message.uselessMeter.score} 
                  rating={message.uselessMeter.rating} 
                />
              )}
            </div>
          ))}
          
          {isTyping && (
            <div style={{
              padding: '0.75rem',
              margin: '0.5rem 0',
              borderRadius: '8px',
              backgroundColor: '#f3e5f5',
              borderLeft: '4px solid #9c27b0',
              opacity: 0.7
            }}>
              <strong>🤖 Dr. You</strong> is typing...
              <div style={{ 
                marginTop: '0.5rem',
                width: '30px',
                height: '6px',
                background: 'linear-gradient(90deg, #9c27b0 25%, transparent 25%)',
                backgroundSize: '10px 6px',
                animation: 'slide 1s infinite'
              }}></div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell your therapist self what's bothering you..."
            disabled={!isConnected || isTyping}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: (!isConnected || isTyping) ? '#f5f5f5' : 'white'
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={!currentMessage.trim() || !isConnected || isTyping}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: (!currentMessage.trim() || !isConnected || isTyping) ? '#ccc' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: (!currentMessage.trim() || !isConnected || isTyping) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Send
          </button>
        </div>

        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.8rem', 
          color: '#666',
          textAlign: 'center'
        }}>
          Press Enter to send • Your therapist self is ready to judge you
        </div>
      </div>

      {/* Quick Therapy Topics */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '2px solid #e0e0e0'
      }}>
        <h4>🎯 Quick Therapy Topics</h4>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Click a topic to get instant disappointment from yourself:
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            "I'm feeling overwhelmed",
            "I can't make decisions", 
            "I procrastinate too much",
            "I'm not happy with my career",
            "I have relationship issues",
            "I don't feel good enough",
            "I'm always stressed",
            "I can't stick to my goals"
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => setCurrentMessage(topic)}
              style={{ 
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                margin: '0.25rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e0e0e0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapySession;
