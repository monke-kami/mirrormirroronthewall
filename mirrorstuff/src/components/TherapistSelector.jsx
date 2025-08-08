import { useState, useEffect } from 'react';
import './TherapistSelector.css';

const TherapistSelector = ({ onStyleSelected, selectedStyle }) => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      // Try backend first, fallback to mock data
      try {
        const response = await fetch('http://localhost:5000/api/avatars/styles');
        if (response.ok) {
          const data = await response.json();
          setStyles(data);
          setLoading(false);
          return;
        }
      } catch (backendError) {
        console.warn('Backend styles failed, using fallback:', backendError);
      }
      
      // Fallback styles for testing
      setStyles([
        { id: 'zen', name: 'Zen You', description: 'Calm, but passive-aggressive', icon: '🧘‍♀️' },
        { id: 'angry', name: 'Angry You', description: 'Tough love, emphasis on tough', icon: '😤' },
        { id: 'condescending', name: 'Condescending You', description: 'Superior attitude, obvious solutions', icon: '🤓' },
        { id: 'chaotic', name: 'Chaotic You', description: 'Unhinged advice, questionable wisdom', icon: '🤪' }
      ]);
    } catch (error) {
      console.error('Failed to fetch styles:', error);
      // Even if everything fails, provide default styles
      setStyles([
        { id: 'zen', name: 'Zen You', description: 'Calm, but passive-aggressive', icon: '🧘‍♀️' },
        { id: 'angry', name: 'Angry You', description: 'Tough love, emphasis on tough', icon: '😤' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="therapist-selector loading">
        <div className="spinner"></div>
        <p>Loading your personality disorders...</p>
      </div>
    );
  }

  return (
    <div className="therapist-selector">
      <div className="selector-header">
        <h3>🎭 Choose Your Therapist Personality</h3>
        <p>Pick which version of yourself will deliver today's emotional damage</p>
      </div>
      
      <div className="styles-grid">
        {styles.map((style) => (
          <div
            key={style.id}
            className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
            onClick={() => onStyleSelected(style.id)}
          >
            <div className="style-icon">{style.icon}</div>
            <div className="style-content">
              <h4>{style.name}</h4>
              <p>{style.description}</p>
            </div>
            <div className="style-indicator">
              {selectedStyle === style.id && <span className="checkmark">✓</span>}
            </div>
          </div>
        ))}
      </div>
      
      <div className="selector-footer">
        <small>💡 Don't worry, they're all equally unhelpful</small>
      </div>
    </div>
  );
};

export default TherapistSelector;
