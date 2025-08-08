import { useState, useEffect } from 'react';
import axios from 'axios';

const TherapyModeSelector = ({ selectedMode, onModeChange }) => {
  const [therapyModes, setTherapyModes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchTherapyModes();
  }, []);

  const fetchTherapyModes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/therapy-modes`);
      setTherapyModes(response.data.therapy_modes);
    } catch (error) {
      console.error('Failed to fetch therapy modes:', error);
      // Fallback to default modes
      setTherapyModes([
        {
          id: "condescending",
          name: "Condescending Expert",
          description: "Treats you like you couldn't figure out 2+2",
          sample: "Obviously, the answer is right in front of you."
        },
        {
          id: "overly_supportive",
          name: "Toxic Positivity",
          description: "Everything is sunshine and rainbows (but passive-aggressively)",
          sample: "You're doing amazing! (At making poor choices.)"
        },
        {
          id: "brutally_honest",
          name: "Brutally Honest",
          description: "No sugar-coating, just harsh reality",
          sample: "Let's be real here - you're the problem."
        },
        {
          id: "passive_aggressive",
          name: "Passive Aggressive",
          description: "Says one thing, means another",
          sample: "That's... interesting. I'm sure it made sense to you."
        },
        {
          id: "confused_intern",
          name: "Confused Intern",
          description: "Clearly has no idea what they're doing",
          sample: "Hmm, let me Google that... I mean, consult my notes."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #e74c3c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p>Loading therapy modes...</p>
      </div>
    );
  }

  return (
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
          Choose Your Therapy Style
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '1rem' }}>
          Select how you want your avatar self to disappoint you
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {therapyModes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            style={{
              padding: '1.5rem',
              border: selectedMode === mode.id ? '3px solid #e74c3c' : '2px solid #e0e0e0',
              borderRadius: '12px',
              backgroundColor: selectedMode === mode.id ? '#fef5f5' : '#f8f9fa',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedMode === mode.id ? '0 4px 15px rgba(231,76,60,0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{mode.name}</h4>
            <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: '#7f8c8d' }}>
              {mode.description}
            </p>
            <div style={{ 
              fontSize: '0.8rem', 
              fontStyle: 'italic', 
              color: '#95a5a6',
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '4px'
            }}>
              Sample: "{mode.sample}"
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: '#f39c12', 
        color: 'white', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <strong>⚠️ Warning:</strong> These therapy styles are designed to be hilariously unhelpful. 
        Don't expect actual therapeutic value.
      </div>
    </div>
  );
};

export default TherapyModeSelector;
