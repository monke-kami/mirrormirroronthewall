import React, { useState, useEffect } from 'react';
import './MirrorInterface.css';

const MirrorInterface = ({ avatarData, selectedStyle, onStyleChange, children }) => {
  const [mirrorEffect, setMirrorEffect] = useState('normal');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Add glitch effect periodically
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000 + Math.random() * 10000); // Random glitches every 5-15 seconds

    return () => clearInterval(glitchInterval);
  }, []);

  const handleMirrorClick = () => {
    const effects = ['normal', 'distorted', 'cracked', 'foggy'];
    const currentIndex = effects.indexOf(mirrorEffect);
    const nextIndex = (currentIndex + 1) % effects.length;
    setMirrorEffect(effects[nextIndex]);
  };

  const generatePixelAvatar = () => {
    // If we have a real pixel avatar from uploaded image
    if (avatarData?.pixelAvatar?.pattern && avatarData.pixelAvatar.isReal) {
      return (
        <div className="pixel-avatar-container real-pixel">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, illum repellat error ullam ducimus blanditiis hic. Molestias quisquam numquam tempora tempore suscipit sapiente, explicabo repellat, eaque, quaerat saepe exercitationem natus.
          <div className="pixel-image">
            {avatarData.pixelAvatar.imageUrl && (
              <img 
                src={avatarData.pixelAvatar.imageUrl} 
                alt="Pixel Avatar" 
                className="pixel-image-display"
              />
            )}
          </div>
          <div className="emoji-pixels">
            {avatarData.pixelAvatar.pattern.map((row, index) => (
              <div key={index} className="pixel-row">
                {row.split('').map((pixel, pixelIndex) => (
                  <span key={pixelIndex} className="pixel-block">
                    {pixel}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // If we have uploaded image but no pixel processing yet
    if (avatarData?.path) {
      return (
        <div className="pixel-avatar-container processing">
          <div className="original-image">
            <img 
              src={avatarData.path} 
              alt="Original Avatar" 
              className="avatar-preview"
            />
          </div>
          <div className="processing-overlay">
            <span className="processing-text">🎮 Pixelating...</span>
          </div>
        </div>
      );
    }

    // Fallback pixel avatar
    const defaultPixelPattern = [
      '⬛⬛🟨🟨🟨🟨⬛⬛',
      '⬛🟨🟨🟨🟨🟨🟨⬛',
      '🟨🟨⬜⬛🟨⬛⬜🟨',
      '🟨🟨🟨🟨🟨🟨🟨🟨',
      '🟨⬛🟨🟨🟨🟨⬛🟨',
      '🟨🟨⬛⬛⬛⬛🟨🟨',
      '⬛🟨🟨🟨🟨🟨🟨⬛',
      '⬛⬛🟨🟨🟨🟨⬛⬛'
    ];

    return (
      <div className="pixel-avatar-container fallback">
        <div className="emoji-pixels">
          {defaultPixelPattern.map((row, index) => (
            <div key={index} className="pixel-row">
              {row.split('').map((pixel, pixelIndex) => (
                <span key={pixelIndex} className="pixel-block">
                  {pixel}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="fallback-text">Upload a photo to see your pixel twin!</div>
      </div>
    );
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

  return (
    <div className={`mirror-interface ${mirrorEffect} ${isGlitching ? 'glitching' : ''}`}>
      {/* Mirror Frame */}
      <div className="mirror-frame">
        <div className="mirror-surface" onClick={handleMirrorClick}>
          {/* Reflection Effect */}
          <div className="mirror-reflection">
            {/* Your Current Self */}
            <div className="mirror-side user-side">
              <div className="mirror-section">
                <h3>You (Current Reality)</h3>
                <div className="user-avatar">
                  {avatarData?.path ? (
                    <div className="real-user-image">
                      <img 
                        src={avatarData.path} 
                        alt="Real You" 
                        className="user-photo"
                      />
                      <span className="user-label">📱 Real</span>
                    </div>
                  ) : (
                    <div className="user-placeholder">
                      <div className="real-person-indicator">�</div>
                      <span className="user-label">Upload Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mirror Line */}
            <div className="mirror-divider">
              <div className="mirror-line"></div>
              <div className="mirror-crack"></div>
            </div>

            {/* Your Digital Twin */}
            <div className="mirror-side avatar-side">
              <div className="mirror-section">
                <h3>Digital You {getStyleEmoji(selectedStyle)}</h3>
                <div className="avatar-display">
                  {generatePixelAvatar()}
                  <div className="avatar-style-indicator">
                    <span className="style-label">{selectedStyle} Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mirror Effects */}
          <div className="mirror-overlay">
            <div className="mirror-glare"></div>
            <div className="mirror-dust"></div>
            {isGlitching && <div className="glitch-overlay"></div>}
          </div>
        </div>

        {/* Style Selector */}
        <div className="style-selector">
          <h4>Choose Your Digital Personality</h4>
          <div className="style-buttons">
            {['zen', 'angry', 'condescending', 'chaotic'].map((style) => (
              <button
                key={style}
                className={`style-btn ${selectedStyle === style ? 'active' : ''}`}
                onClick={() => onStyleChange(style)}
              >
                {getStyleEmoji(style)}
                <span>{style}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="mirror-chat-container">
        {children}
      </div>

      {/* Mirror Instructions */}
      <div className="mirror-instructions">
        <p>💡 Click the mirror to change reflection effects</p>
        <p>🎭 Your pixel twin will judge you accordingly</p>
      </div>
    </div>
  );
};

export default MirrorInterface;
