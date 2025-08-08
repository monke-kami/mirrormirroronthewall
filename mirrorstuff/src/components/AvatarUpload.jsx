import { useState, useRef } from 'react';
import './AvatarUpload.css';
import { ClientPixelAvatarGenerator } from '../utils/pixelAvatarGenerator';

const AvatarUpload = ({ onAvatarUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    
    try {
      // Generate pixel avatar from the uploaded image first
      console.log('Generating pixel avatar from uploaded image...');
      const pixelAvatar = await ClientPixelAvatarGenerator.generatePixelAvatar(file, {
        pixelSize: 8,
        width: 64,
        height: 64,
        colors: 16
      });
      
      // Try backend upload first, fallback to mock if it fails
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('http://localhost:5000/api/avatars/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          // Add pixel avatar to the backend response
          data.avatar.pixelAvatar = pixelAvatar;
          onAvatarUploaded?.(data.avatar);
          return;
        }
      } catch (backendError) {
        console.warn('Backend upload failed, using mock upload with pixel avatar:', backendError);
      }
      
      // Mock upload for testing with generated pixel avatar
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload time
      
      const mockAvatar = {
        id: Date.now(),
        filename: `avatar-${Date.now()}-${file.name}`,
        originalName: file.name,
        path: URL.createObjectURL(file), // Create a local preview URL
        size: file.size,
        uploadedAt: new Date(),
        processed: true,
        pixelAvatar: pixelAvatar // Include the generated pixel avatar
      };
      
      onAvatarUploaded?.(mockAvatar);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
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
    handleFileSelect(file);
  };

  return (
    <div className="avatar-upload">
      <div 
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className="upload-loading">
            <div className="spinner"></div>
            <p>Creating your digital twin...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h3>Upload Your Selfie</h3>
            <p>Drop your photo here or click to browse</p>
            <div className="upload-note">
              <small>We'll turn you into your own worst therapist 😈</small>
            </div>
          </div>
        )}
      </div>
      
      <div className="upload-tips">
        <h4>📋 Tips for best results:</h4>
        <ul>
          <li>🎯 Face the camera directly</li>
          <li>💡 Use good lighting</li>
          <li>😐 Neutral expression works best</li>
          <li>🚫 No sunglasses or hats</li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarUpload;
