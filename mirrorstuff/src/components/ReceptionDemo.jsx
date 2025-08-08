import { useState } from 'react'
import Reception from './Reception'
import './ReceptionDemo.css'

const ReceptionDemo = () => {
  const [currentView, setCurrentView] = useState('react')

  return (
    <div className="demo-container">
      <div className="demo-controls">
        <h2>Reception Demo</h2>
        <div className="button-group">
          <button 
            className={currentView === 'react' ? 'active' : ''}
            onClick={() => setCurrentView('react')}
          >
            React Version
          </button>
          <button 
            className={currentView === 'html' ? 'active' : ''}
            onClick={() => setCurrentView('html')}
          >
            HTML Version
          </button>
        </div>
      </div>

      <div className="demo-content">
        {currentView === 'react' ? (
          <Reception />
        ) : (
          <iframe 
            src="/src/assets/reception" 
            className="html-iframe"
            title="HTML Reception"
          />
        )}
      </div>
    </div>
  )
}

export default ReceptionDemo
