import { useState } from 'react';
import axios from 'axios';

const AvatarGenerator = ({ 
  uploadedFile, 
  therapyMode, 
  onAvatarGenerated, 
  onBack, 
  isLoading, 
  setIsLoading, 
  setError 
}) => {
  const [generationStatus, setGenerationStatus] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:5000';

  const generateAvatar = async () => {
    setIsLoading(true);
    setError(null);
    setGenerationStatus('Initializing avatar generation...');

    try {
      // Simulate generation steps for better UX
      const steps = [
        'Analyzing your face for therapeutic potential...',
        'Adding disapproving expression...',
        'Installing judgmental stare...',
        'Calibrating sarcasm levels...',
        'Adding fake diplomas to background...',
        'Finalizing your therapeutic doppelganger...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationStatus(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const response = await axios.post(`${API_BASE_URL}/api/generate-avatar`, {
        file_id: uploadedFile.file_id,
        customization: {
          therapy_style: therapyMode,
          sarcasm_level: 0.8,
          accessories: ['therapist_glasses', 'notepad', 'judgmental_expression']
        }
      });

      if (response.data.success) {
        setGenerationStatus('Avatar generation complete!');
        setTimeout(() => {
          onAvatarGenerated(response.data.data);
        }, 1000);
      } else {
        setError(response.data.message || 'Avatar generation failed');
      }
    } catch (error) {
      console.error('Avatar generation error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes('Network Error')) {
        setError('Cannot connect to server. Make sure the backend is running.');
      } else {
        setError('Avatar generation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setGenerationStatus('');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '0.5rem' }}>
          Step 2: Generate Your Therapist Avatar
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '1rem' }}>
          Transform your selfie into a professionally disappointing therapist
        </p>
      </div>

      {/* Show uploaded image info */}
      <div style={{ 
        background: '#ecf0f1', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>📁 Uploaded Image</h4>
        <p><strong>File ID:</strong> {uploadedFile.file_id}</p>
        <p><strong>Status:</strong> {uploadedFile.message}</p>
        <p><strong>Face Detection:</strong> ✅ Face detected and ready for judgment</p>
        <p><strong>Selected Therapy Style:</strong> <span style={{color: '#e74c3c'}}>{therapyMode}</span></p>
      </div>

      {/* Avatar customization options */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🎭 Avatar Customization</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h5 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>👓 Accessories</h5>
            <p>✅ Therapist glasses</p>
            <p>✅ Professional notepad</p>
            <p>✅ Judgmental expression</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h5 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🎨 Background</h5>
            <p>✅ Fake diplomas</p>
            <p>✅ Tissue box (for your tears)</p>
            <p>✅ Uncomfortable couch</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h5 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>😏 Personality</h5>
            <p>✅ Maximum sarcasm</p>
            <p>✅ Professional disappointment</p>
            <p>✅ Emotional unavailability</p>
          </div>
        </div>
      </div>

      {/* Generation controls */}
      <div style={{ textAlign: 'center' }}>
        {!isLoading ? (
          <div>
            <button 
              onClick={generateAvatar}
              style={{ 
                fontSize: '1.1rem', 
                padding: '1rem 2rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              🎭 Generate My Therapist Avatar
            </button>
            <button 
              onClick={onBack}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#7f8c8d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← Back to Upload
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #e74c3c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <h3 style={{ color: '#2c3e50' }}>Creating Your Avatar...</h3>
            <p style={{ color: '#e74c3c', fontStyle: 'italic' }}>
              {generationStatus}
            </p>
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: '#ecf0f1', 
              borderRadius: '8px'
            }}>
              <p><strong>Estimated time:</strong> 2-3 minutes</p>
              <p><strong>Quality guarantee:</strong> Maximum therapeutic uselessness</p>
            </div>
          </div>
        )}
      </div>

      {/* Fun facts while waiting */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        borderLeft: '4px solid #e74c3c'
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>💡 Did You Know?</h4>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#7f8c8d' }}>
          <li>73% of people argue with themselves in mirrors anyway</li>
          <li>This app makes that socially acceptable</li>
          <li>Your avatar will have a PhD in Disappointment Studies</li>
          <li>Side effects may include increased self-awareness and existential dread</li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarGenerator;
