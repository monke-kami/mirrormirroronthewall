
import { useState } from 'react'
import Notepad from './Notepad'
import './Reception.css'
import ApiService from '../services/api'

const Reception = ({ onLoginSuccess }) => {
  const [showNotepad, setShowNotepad] = useState(false)
  const [error, setError] = useState('')

  const handleNotepadClick = () => {
    setShowNotepad(true)
  }

  const handleNotepadSubmit = async (user) => {
    console.log('Therapist authenticated:', user)
    setShowNotepad(false)
    
    // Wait a moment for visual feedback
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(user)
      }
    }, 500)
  }

  const handleNotepadClose = () => {
    setShowNotepad(false)
  }

  return (
    <div className="reception-container">
      <div className="scene" id="scene">
        <div 
          className="notepad-clickable" 
          onClick={handleNotepadClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNotepadClick()}
          aria-label="Click to open therapist sign-in"
        />
      </div>

      <Notepad 
        isVisible={showNotepad}
        onSubmit={handleNotepadSubmit}
        onClose={handleNotepadClose}
      />
      {error && <div style={{color: 'red', textAlign: 'center', marginTop: 10}}>{error}</div>}
    </div>
  )
}

export default Reception
