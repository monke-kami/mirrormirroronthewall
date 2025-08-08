import './NotepadIcon.css'

const NotepadIcon = ({ onClick, className = '' }) => {
  return (
    <div 
      className={`notepad-icon ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="notepad-placeholder">📝</div>
    </div>
  )
}

export default NotepadIcon
