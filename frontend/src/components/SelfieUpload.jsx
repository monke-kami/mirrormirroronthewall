import { useState, useRef } from 'react';
import axios from 'axios';

const SelfieUpload = ({ onSelfieUploaded, isLoading, setIsLoading, setError }) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      setError('File size too large. Please upload an image smaller than 16MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload the file
    uploadSelfie(file);
  };

  const uploadSelfie = async (file) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('selfie', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload-selfie`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onSelfieUploaded(response.data.data);
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes('Network Error')) {
        setError('Cannot connect to server. Make sure the backend is running on http://127.0.0.1:5000');
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
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
          Step 1: Upload Your Selfie
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '1rem' }}>
          We need your face to create your personalized therapist doppelganger
        </p>
      </div>

      {preview ? (
        <div style={{ textAlign: 'center' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              borderRadius: '10px',
              marginBottom: '1rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          />
          <div>
            <button 
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={isLoading}
              style={{
                backgroundColor: '#7f8c8d',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              Choose Different Photo
            </button>
          </div>
          {isLoading && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #e74c3c',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
              <p>Processing your selfie... Preparing for therapeutic judgment...</p>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          style={{
            border: dragOver ? '3px dashed #e74c3c' : '2px dashed #bdc3c7',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: dragOver ? '#fef5f5' : '#f8f9fa',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Upload Your Selfie</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>Drag and drop your photo here, or click to select</p>
          <p style={{ fontSize: '0.9rem', color: '#95a5a6', marginTop: '1rem' }}>
            Supported formats: JPG, PNG, GIF • Max size: 16MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#ecf0f1', 
        borderRadius: '8px' 
      }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>📋 Upload Guidelines:</h4>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#7f8c8d' }}>
          <li>Use a clear, well-lit photo of your face</li>
          <li>Face should be clearly visible and centered</li>
          <li>Avoid sunglasses or masks (we need to see your face to disappoint it)</li>
          <li>Higher quality images produce better avatars</li>
        </ul>
      </div>
    </div>
  );
};

export default SelfieUpload;
