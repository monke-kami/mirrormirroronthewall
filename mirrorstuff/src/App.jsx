import { useState } from 'react'
import './App.css'
import Notepad from './components/Notepad'
import NotepadIcon from './components/NotepadIcon'
import Reception from './components/Reception'

function App() {
  const [showNotepad, setShowNotepad] = useState(false)
  const [currentView, setCurrentView] = useState('reception') // 'reception' or 'original'

  const handleNotepadClick = () => {
    setShowNotepad(true)
  }

  const handleCloseNotepad = () => {
    setShowNotepad(false)
  }

  const handleSubmit = (credentials) => {
    console.log('Credentials submitted:', credentials)
    alert(`Welcome, Dr. ${credentials.username}! Session starting...`)
    setShowNotepad(false)
  }

  return (
    <div className="app-container">
      {/* View switcher */}
      <div className="view-switcher">
        <button 
          className={currentView === 'reception' ? 'active' : ''}
          onClick={() => setCurrentView('reception')}
        >
          Reception View
        </button>
        <button 
          className={currentView === 'original' ? 'active' : ''}
          onClick={() => setCurrentView('original')}
        >
          Original View
        </button>
      </div>

      {currentView === 'reception' ? (
        <Reception />
      ) : (
        <div className="reception-scene">
          <NotepadIcon 
            className="notepad-clickable clickable-area" 
            onClick={handleNotepadClick}
          />

          <Notepad 
            isVisible={showNotepad}
            onSubmit={handleSubmit}
            onClose={handleCloseNotepad}
          />
        </div>
      )}
    </div>
  )
}

export default App
