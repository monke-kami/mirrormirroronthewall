import { useState, useRef, useEffect } from 'react';
import './TherapySession.css';
import MirrorInterface from './MirrorInterface';

const TherapySession = ({ avatarStyle = 'zen', onEndSession, avatarData, username }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [currentStyle, setCurrentStyle] = useState(avatarStyle);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting when style changes
  useEffect(() => {
    const greetings = {
      zen: `${username}, welcome to your inner peace... which doesn't exist. I'm your zen digital twin, here to judge your chakras. What's bothering you today? 🧘‍♀️`,
      angry: `${username}! Alright, let's get this over with. I'm your angry digital self and I'm TIRED of your nonsense! What are you crying about now?! 😤`,
      condescending: `Oh look, ${username} finally decided to seek help. I'm your intellectually superior digital twin. How... predictable. What obvious mistake did you make this time? 🤓`,
      chaotic: `HELLO ${username.toUpperCase()}! I'M YOUR CHAOTIC DIGITAL TWIN! Ready for some FANTASTIC advice that definitely won't work but will be ENTERTAINING? What's up?! 🤪`
    };

    setTimeout(() => {
      setMessages([{
        id: 1,
        type: 'therapist',
        text: greetings[currentStyle] || greetings.zen,
        style: currentStyle,
        timestamp: new Date(),
        uselessnessLevel: 2
      }]);
    }, 1000);
  }, [currentStyle, username]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      let therapistData;
      
      // Try backend first, fallback to enhanced AI responses
      try {
        const response = await fetch('http://localhost:5000/api/therapy/respond', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMessage,
            style: currentStyle,
            sessionId: sessionId
          }),
        });

        if (response.ok) {
          therapistData = await response.json();
        } else {
          throw new Error('Backend response not ok');
        }
      } catch (backendError) {
        console.warn('Backend therapy failed, using enhanced AI fallback:', backendError);
        
        // Enhanced contextual responses
        const enhancedResponses = {
          zen: [
            `${username}, have you tried... not having problems? *serenely judgmental*`,
            "Breathe deeply. Then ask yourself why you're still making the same mistakes.",
            "Inner peace comes from accepting that you're the source of your own drama.",
            "The universe is vast and infinite, but somehow your problems feel bigger. How enlightening.",
            "Perhaps the real therapy was the overthinking you did along the way. Namaste... away from your problems."
          ],
          angry: [
            `${username}, seriously?! THAT'S what you're upset about? GET IT TOGETHER!`,
            "You know what your problem is? You keep asking me instead of FIXING IT!",
            "I can't believe I have to explain this to myself. DO BETTER!",
            "Stop whining and start DOING something about it! I'm literally you and even I'm frustrated!",
            "OH FOR THE LOVE OF... just THINK before you act next time! It's not rocket science!"
          ],
          condescending: [
            `Oh ${username}, how... quaint. Obviously the solution is to make better choices. You're welcome.`,
            "Did you try thinking before acting? Revolutionary concept, I know.",
            "It's almost like actions have consequences. Who could have predicted this? (Me. I predicted this.)",
            "Let me break this down for you since you clearly need help understanding basic logic...",
            "Well, obviously you're missing the bigger picture here. Allow me to enlighten you."
          ],
          chaotic: [
            `${username}! Have you considered becoming a professional llama trainer? Problems = SOLVED!`,
            "The answer is clearly to befriend a houseplant and ask for life advice. They're great listeners!",
            "Why fix problems when you can create NEW and more interesting ones? Think outside the box!",
            "I suggest interpretive dance. It won't help, but it'll be entertaining for everyone watching!",
            "What if your problems are just features in disguise? Embrace the chaos! 🦄✨"
          ]
        };
        
        const responses = enhancedResponses[currentStyle] || enhancedResponses.zen;
        const mockText = responses[Math.floor(Math.random() * responses.length)];
        const mockUselessness = Math.floor(Math.random() * 5) + 1;
        
        therapistData = {
          id: Date.now() + 1,
          response: mockText,
          style: currentStyle,
          timestamp: new Date().toISOString(),
          uselessnessLevel: mockUselessness,
          uselessnessLabel: mockUselessness >= 4 ? 'Completely Useless' : 
                           mockUselessness >= 3 ? 'Mostly Useless' : 
                           mockUselessness >= 2 ? 'Somewhat Useless' : 'Surprisingly Helpful'
        };
      }

      // Simulate typing delay with personality
      const typingDelay = currentStyle === 'chaotic' ? 500 + Math.random() * 1000 : 
                         currentStyle === 'angry' ? 800 + Math.random() * 500 :
                         currentStyle === 'zen' ? 2000 + Math.random() * 1000 : 
                         1200 + Math.random() * 800;

      setTimeout(() => {
        const therapistMessage = {
          id: therapistData.id,
          type: 'therapist',
          text: therapistData.response,
          style: therapistData.style,
          timestamp: new Date(therapistData.timestamp),
          uselessnessLevel: therapistData.uselessnessLevel,
          uselessnessLabel: therapistData.uselessnessLabel
        };

        setMessages(prev => [...prev, therapistMessage]);
        setIsTyping(false);
      }, typingDelay);

    } catch (error) {
      console.error('Failed to get response:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now(),
        type: 'therapist',
        text: "Great, now even I'm broken. That's probably your fault too. Try again, I guess.",
        style: currentStyle,
        timestamp: new Date(),
        uselessnessLevel: 5
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStyleEmoji = (style) => {
    const emojis = {
      zen: '🧘‍♀️',
      angry: '😤',
      condescending: '🤓',
      chaotic: '🤪'
    };
    return emojis[style] || '🤖';
  };

  const handleStyleChange = (newStyle) => {
    setCurrentStyle(newStyle);
    // Add system message about style change
    const styleChangeMessage = {
      id: Date.now(),
      type: 'system',
      text: `Your digital twin has shifted to ${newStyle} mode. Brace yourself...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, styleChangeMessage]);
  };

  return (
    <MirrorInterface 
      avatarData={avatarData} 
      selectedStyle={currentStyle} 
      onStyleChange={handleStyleChange}
    >
      <div className="therapy-session">
        <div className="session-header">
          <div className="session-info">
            <h2>Therapy Session with Digital You {getStyleEmoji(currentStyle)}</h2>
            <p className="session-subtitle">
              {username} vs. {username} (Digital Twin Edition)
            </p>
          </div>
          <button 
            className="end-session-btn" 
            onClick={onEndSession}
            title="Escape this digital nightmare"
          >
            End Session
          </button>
        </div>

        <div className="chat-container">
          <div className="messages-area">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.type}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender">
                      {message.type === 'user' ? `${username} (Real)` : 
                       message.type === 'system' ? 'System' :
                       `Digital ${username} (${message.style})`}
                    </span>
                    {message.type === 'therapist' && message.uselessnessLevel && (
                      <span className={`uselessness-meter level-${message.uselessnessLevel}`}>
                        {message.uselessnessLabel || 'Useless'} 
                        {'⭐'.repeat(message.uselessnessLevel)}
                      </span>
                    )}
                  </div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message therapist typing">
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender">Digital {username} ({currentStyle})</span>
                  </div>
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-text">
                      {currentStyle === 'zen' ? 'Contemplating your existence...' :
                       currentStyle === 'angry' ? 'Preparing to roast you...' :
                       currentStyle === 'condescending' ? 'Formulating obvious advice...' :
                       'Generating chaos...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Tell your digital twin what's bothering you... ${getStyleEmoji(currentStyle)}`}
                className="message-input"
                rows="2"
                disabled={isTyping}
              />
              <button 
                onClick={sendMessage} 
                disabled={!currentMessage.trim() || isTyping}
                className="send-button"
              >
                Send to Mirror
              </button>
            </div>
          </div>
        </div>
      </div>
    </MirrorInterface>
  );
};

export default TherapySession;
