import { useState } from 'react'
import './Notepad.css'
import ApiService from '../services/api'

const Notepad = ({ onSubmit, onClose, isVisible = true }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    license: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await ApiService.login(credentials)
      console.log('Login successful:', response)
      onSubmit?.(response.user)
      setCredentials({ username: '', password: '', license: '' })
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCredentials({ username: '', password: '', license: '' })
    setError('')
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className="notepad-overlay" onClick={(e) => e.target.className === 'notepad-overlay' && handleClose()}>
      <div className="notepad-container">
        <button className="close-btn" onClick={handleClose}>&times;</button>
        <div className="credential-form">
          <div className="form-title">THERAPIST SIGN-IN</div>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
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
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Begin Session'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Notepad
