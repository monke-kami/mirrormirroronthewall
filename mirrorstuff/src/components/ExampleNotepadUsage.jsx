import { useState } from 'react'
import Notepad from './Notepad'
import NotepadIcon from './NotepadIcon'
import './ExampleNotepadUsage.css'

const ExampleNotepadUsage = () => {
  const [showNotepad, setShowNotepad] = useState(false)

  const handleNotepadSubmit = (credentials) => {
    console.log('Form submitted with:', credentials)
    alert(`Hello, ${credentials.username}!`)
    setShowNotepad(false)
  }

  const handleNotepadClose = () => {
    setShowNotepad(false)
  }

  return (
    <div className="example-container">
      <h2>Notepad Component Examples</h2>
      
      <div className="example-section">
        <h3>1. Clickable Notepad Icon</h3>
        <div className="icon-examples">
          <div className="icon-example">
            <p>Small notepad icon:</p>
            <NotepadIcon 
              className="small-notepad"
              onClick={() => setShowNotepad(true)}
            />
          </div>
          
          <div className="icon-example">
            <p>Medium notepad icon:</p>
            <NotepadIcon 
              className="medium-notepad"
              onClick={() => setShowNotepad(true)}
            />
          </div>
          
          <div className="icon-example">
            <p>Large notepad icon:</p>
            <NotepadIcon 
              className="large-notepad"
              onClick={() => setShowNotepad(true)}
            />
          </div>
        </div>
      </div>

      <div className="example-section">
        <h3>2. Simple Button to Open Notepad</h3>
        <button 
          className="example-btn"
          onClick={() => setShowNotepad(true)}
        >
          Open Notepad Form
        </button>
      </div>

      <Notepad 
        isVisible={showNotepad}
        onSubmit={handleNotepadSubmit}
        onClose={handleNotepadClose}
      />
    </div>
  )
}

export default ExampleNotepadUsage
