// AIPopup component for WebGIS application
// No import/export statements for browser-based usage

function AIPopup({ 
  show, 
  onClose, 
  chatInput, 
  setChatInput, 
  chatResults, 
  handleChatSubmit,
  aiMode,
  setAiMode,
  loadingLLM,
  setLoadingLLM
}) {
  return show ? (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 30,
        transform: 'translateX(-50%)',
        zIndex: 2000,
        width: 600,
        maxWidth: '98vw',
        background: 'linear-gradient(120deg,#f8f8fa 60%,#f3f3f7 100%)',
        border: '1.5px solid #e0e0e0',
        borderRadius: 18,
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', background: '#fff', borderBottom: '1px solid #eee', padding: '14px 18px 10px 18px'}}>
        <i className="fa fa-robot" style={{color: '#72383d', fontSize: '1.3rem', marginRight: 10}}></i>
        <span style={{fontWeight: 700, color: '#333', fontSize: '1.08rem', flex: 1}}>Ask Bengaluru Heritage AI</span>
        <button
          onClick={onClose}
          style={{background: 'none', border: 'none', color: '#888', fontSize: '1.25rem', marginLeft: 8, cursor: 'pointer', padding: 2}}
          title="Close"
          aria-label="Close AI Chat"
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
      
      {/* Chat area */}
      <div style={{flex: 1, background: 'transparent', padding: '18px 18px 0 18px', maxHeight: 260, overflowY: 'auto', fontSize: '1.01rem', display: 'flex', flexDirection: 'column', gap: 10}}>
        {chatResults.length === 0 && (
          <div style={{color: '#aaa', textAlign: 'center', marginTop: 30, fontSize: '1.05em'}}>Start a conversation about Bengaluru's heritage...</div>
        )}
        {chatResults.map((msg, idx) => (
          <div key={idx} style={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <div style={{alignSelf: 'flex-end', background: '#e6f0ea', color: '#333', borderRadius: 12, padding: '7px 13px', maxWidth: '85%', fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>{msg.user}</div>
            <div style={{alignSelf: 'flex-start', background: '#fff', color: '#72383d', borderRadius: 12, padding: '7px 13px', maxWidth: '85%', fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
              <span style={{fontWeight: 600, fontSize: '0.97em', marginRight: 6}}><i className="fa fa-robot" style={{marginRight: 4}}></i>AI:</span> {msg.ai}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleChatSubmit} style={{display: 'flex', alignItems: 'center', gap: 8, background: '#f7f7fa', borderTop: '1px solid #eee', padding: '12px 14px'}}>
        <input
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Type your question..."
          style={{flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '1.08em', padding: '7px 2px'}}
          autoFocus
        />
        <button type="submit" className="btn btn-theme" style={{padding: '6px 18px', borderRadius: 8, fontWeight: 600, fontSize: '1em', background: '#72383d', color: '#fff', border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>Send</button>
        
        {/* Toggle Switch for Smart AI */}
        <label style={{display: 'flex', alignItems: 'center', marginLeft: 8, userSelect: 'none', cursor: loadingLLM ? 'not-allowed' : 'pointer', fontSize: '0.97em'}} title="Toggle Smart AI (WebLLM)">
          <span style={{marginRight: 4, color: aiMode === 'rule' ? '#72383d' : '#888'}}>Basic</span>
          <span style={{position: 'relative', display: 'inline-block', width: 32, height: 18, marginRight: 4}}>
            <input
              type="checkbox"
              checked={aiMode === 'webllm'}
              disabled={loadingLLM}
              onChange={async e => {
                if (e.target.checked) {
                  if (typeof setLoadingLLM === 'function') {
                    setLoadingLLM(true);
                  }
                  if (window.enableWebLLM) {
                    await window.enableWebLLM();
                    if (window.webllmEnabled && window.webllmEngine) {
                      setAiMode('webllm');
                    } else {
                      alert('WebLLM could not be loaded. Please check your browser compatibility.');
                      setAiMode('rule');
                    }
                  } else {
                    alert('WebLLM loader not found.');
                    setAiMode('rule');
                  }
                  if (typeof setLoadingLLM === 'function') {
                    setLoadingLLM(false);
                  }
                } else {
                  setAiMode('rule');
                }
              }}
              style={{opacity: 0, width: 0, height: 0, position: 'absolute'}}
            />
            <span style={{
              position: 'absolute',
              cursor: loadingLLM ? 'not-allowed' : 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: aiMode === 'webllm' ? '#72383d' : '#ccc',
              borderRadius: 10,
              transition: 'background 0.2s'
            }}></span>
            <span style={{
              position: 'absolute',
              left: aiMode === 'webllm' ? 16 : 2,
              top: 2,
              width: 14,
              height: 14,
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              transition: 'left 0.2s'
            }}></span>
          </span>
          <span style={{color: aiMode === 'webllm' ? '#72383d' : '#888'}}>Smart</span>
        </label>
      </form>
    </div>
  ) : null;
}

// Make AIPopup available globally
window.AIPopup = AIPopup;
