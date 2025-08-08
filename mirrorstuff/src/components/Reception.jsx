import { useState } from 'react'
import Notepad from './Notepad'
import './Reception.css'

const Reception = () => {
  const [showNotepad, setShowNotepad] = useState(false)

  const handleNotepadClick = () => {
    setShowNotepad(true)
  }

  const handleNotepadSubmit = (credentials) => {
    console.log('Therapist credentials:', credentials)
    alert(`Welcome, Dr. ${credentials.username}! Session starting...`)
    setShowNotepad(false)
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
    </div>
  )
}

export default Reception
