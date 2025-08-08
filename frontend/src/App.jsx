import { useState, useEffect } from 'react'
// import './App.css'  // Temporarily disabled
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import SelfieUpload from './components/SelfieUpload'
import AvatarGenerator from './components/AvatarGenerator'
import TherapySession from './components/TherapySession'
import TherapyModeSelector from './components/TherapyModeSelector'

// App stages
const STAGES = {
  UPLOAD: 'upload',
  GENERATE: 'generate', 
  THERAPY: 'therapy'
}

function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.UPLOAD)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [generatedAvatar, setGeneratedAvatar] = useState(null)
  const [therapyMode, setTherapyMode] = useState('condescending')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle successful selfie upload
  const handleSelfieUploaded = (fileData) => {
    setUploadedFile(fileData)
    setCurrentStage(STAGES.GENERATE)
    setError(null)
  }

  // Handle successful avatar generation
  const handleAvatarGenerated = (avatarData) => {
    setGeneratedAvatar(avatarData)
    setCurrentStage(STAGES.THERAPY)
    setError(null)
  }

  // Handle going back to previous stage
  const goBack = () => {
    setError(null)
    if (currentStage === STAGES.THERAPY) {
      setCurrentStage(STAGES.GENERATE)
    } else if (currentStage === STAGES.GENERATE) {
      setCurrentStage(STAGES.UPLOAD)
      setUploadedFile(null)
    }
  }

  // Start over completely
  const startOver = () => {
    setCurrentStage(STAGES.UPLOAD)
    setUploadedFile(null)
    setGeneratedAvatar(null)
    setError(null)
  }

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Header currentStage={currentStage} />
        
        <main style={{ padding: '2rem' }}>
          {error && (
            <div style={{ 
              backgroundColor: '#ff6b6b', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Stage-specific content */}
          {currentStage === STAGES.UPLOAD && (
            <div>
              <SelfieUpload onSelfieUploaded={handleSelfieUploaded} />
            </div>
          )}

          {currentStage === STAGES.GENERATE && uploadedFile && (
            <div>
              <TherapyModeSelector 
                selectedMode={therapyMode}
                onModeChange={setTherapyMode}
              />
              <AvatarGenerator 
                uploadedFile={uploadedFile}
                therapyMode={therapyMode}
                onAvatarGenerated={handleAvatarGenerated}
                onGoBack={goBack}
              />
            </div>
          )}

          {currentStage === STAGES.THERAPY && generatedAvatar && (
            <div>
              <TherapySession 
                avatar={generatedAvatar}
                therapyMode={therapyMode}
                onStartOver={startOver}
                onGoBack={goBack}
              />
            </div>
          )}

          {/* Footer with disclaimer */}
          <div style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <p style={{color: '#666', fontStyle: 'italic', margin: 0}}>
              <strong>Disclaimer:</strong> This is not actual therapy. For real mental health support, 
              please consult licensed professionals. This app is for entertainment purposes only and 
              may cause existential questioning about talking to yourself.
            </p>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
