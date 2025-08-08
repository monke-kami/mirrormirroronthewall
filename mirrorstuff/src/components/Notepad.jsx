import { useState } from 'react'
import './Notepad.css'

const Notepad = ({ onSubmit, onClose, isVisible = true }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    license: ''
  })

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(credentials)
    setCredentials({ username: '', password: '', license: '' })
  }

  const handleClose = () => {
    setCredentials({ username: '', password: '', license: '' })
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className="notepad-overlay" onClick={(e) => e.target.className === 'notepad-overlay' && handleClose()}>
      <div className="notepad-container">
        <button className="close-btn" onClick={handleClose}>&times;</button>
        <div className="credential-form">
          <div className="form-title">THERAPIST SIGN-IN</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">DR. NAME:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your name..."
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">PASSWORD:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="license">LICENSE #:</label>
              <input 
                type="text" 
                id="license" 
                name="license" 
                value={credentials.license}
                onChange={handleInputChange}
                placeholder="e.g. PSY12345"
                required 
              />
            </div>
            <button type="submit" className="submit-btn">Begin Session</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Notepad
