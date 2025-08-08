import { useState } from 'react'
import './App.css'
import Notepad from './components/Notepad'
import NotepadIcon from './components/NotepadIcon'
import Reception from './components/Reception'
import DeepfakeTherapist from './components/DeepfakeTherapist'
import MVPMirrorApp from './components/MVPMirrorApp'
import ApiService from './services/api'

function App() {
  const [showNotepad, setShowNotepad] = useState(false)
  const [currentView, setCurrentView] = useState('reception') // Start with MVP for hackathon demo
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleNotepadClick = () => {
    setShowNotepad(true)
  }

  const handleCloseNotepad = () => {
    setShowNotepad(false)
  }

  const handleSubmit = (user) => {
    console.log('User authenticated:', user)
    setAuthenticatedUser(user)
    setIsLoggedIn(true)
    setCurrentView('deepfake') // Redirect to deepfake therapist after login
    setShowNotepad(false)
  }

  const handleLogout = () => {
    setAuthenticatedUser(null)
    setIsLoggedIn(false)
    setCurrentView('reception')
    ApiService.logout()
  }

  return (
    <div className="app-container">
      {/* View switcher */}
      {/* <div className="view-switcher">
        <button 
          className={currentView === 'mvp' ? 'active' : ''}
          onClick={() => setCurrentView('mvp')}
        >
          🪞 MVP Demo
        </button>
        {!isLoggedIn ? (
          // Show only reception when not logged in
          <button 
            className={currentView === 'reception' ? 'active' : ''}
            onClick={() => setCurrentView('reception')}
          >
            🏥 Therapist Login
          </button>
        ) : (
          // Show all options when logged in
          <>
            <button 
              className={currentView === 'deepfake' ? 'active' : ''}
              onClick={() => setCurrentView('deepfake')}
            >
              🤖 Deepfake Therapist
            </button>
            <button 
              className={currentView === 'reception' ? 'active' : ''}
              onClick={() => setCurrentView('reception')}
            >
              🏥 Reception View
            </button>
            <button 
              className={currentView === 'original' ? 'active' : ''}
              onClick={() => setCurrentView('original')}
            >
              📝 Original View
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </>
        )}
      </div> */}

      {/* Main content */}
      {currentView === 'mvp' ? (
        <MVPMirrorApp />
      ) : !isLoggedIn ? (
        <Reception onLoginSuccess={handleSubmit} />
      ) : currentView === 'deepfake' ? (
        <DeepfakeTherapist authenticatedUser={authenticatedUser} />
      ) : currentView === 'reception' ? (
        <Reception onLoginSuccess={handleSubmit} />
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
