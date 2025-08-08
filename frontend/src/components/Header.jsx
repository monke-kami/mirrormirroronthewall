const Header = ({ currentStage }) => {
  const stages = [
    { id: 'upload', name: 'Upload Selfie', number: 1 },
    { id: 'generate', name: 'Generate Avatar', number: 2 },
    { id: 'therapy', name: 'Therapy Session', number: 3 }
  ];

  const getStageStatus = (stageId) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    const stageIndex = stages.findIndex(s => s.id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      padding: '1.5rem 2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>
          🤖🪞 Mirror Mirror on the Wall
        </h1>
        <p style={{ color: '#ecf0f1', fontStyle: 'italic', opacity: '0.9', fontSize: '1.1rem', marginBottom: '1rem' }}>
          "Because sometimes, the only person qualified to roast you... is also you."
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          {stages.map((stage) => {
            const status = getStageStatus(stage.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';
            
            return (
              <div 
                key={stage.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : isCompleted ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.1)',
                  border: isActive ? '2px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#27ae60' : isActive ? '#e74c3c' : 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {isCompleted ? '✓' : stage.number}
                </div>
                <span style={{ fontSize: '0.9rem' }}>{stage.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
