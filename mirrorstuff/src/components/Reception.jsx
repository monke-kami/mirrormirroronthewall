
import { useState } from 'react'
import Notepad from './Notepad'
import './Reception.css'
import ApiService from '../services/api'

const Reception = () => {
  const [showNotepad, setShowNotepad] = useState(false)

  const handleNotepadClick = () => {
    setShowNotepad(true)
  }

  const [error, setError] = useState('')

  const handleNotepadSubmit = async (credentials) => {
    setError('')
    try {
      const response = await ApiService.login(credentials)
      alert(`Welcome, Dr. ${response.user.username}! Session starting...`)
      setShowNotepad(false)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
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
