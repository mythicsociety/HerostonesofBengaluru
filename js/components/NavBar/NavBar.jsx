// NavBar component for the WebGIS application
// No import/export statements for browser-based usage

function NavBar() {
  return (
    <nav className="navbar" style={{justifyContent: 'flex-start', position: 'relative', display: 'flex', alignItems: 'center'}}>
      <img
        src="assets/Mythic Society Logo.jpg"
        alt="Mythic Society Logo"
        className="navbar-logo"
        style={{marginLeft: '15px'}}
      />
      <div style={{marginLeft: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <span style={{fontSize: '1.72rem', fontWeight: 700, lineHeight: 1, color: '#fff', letterSpacing: '1px'}}>The Mythic Society</span>
        <span style={{fontSize: '0.95rem', color: '#fff', opacity: 0.85, fontWeight: 400, marginTop: '2px'}}>Nrupatunga Road, Bengaluru - 01</span>
      </div>
      {/* Centered duplicate */}
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 1}}>
        <span style={{fontSize: '1.62rem', fontWeight: 400, lineHeight: 1, color: '#fff', letterSpacing: '1px', textAlign: 'center'}}>Bengaluru Heritage Sites</span>
        <span style={{fontSize: '0.95rem', color: '#fff', opacity: 0.85, fontWeight: 400, marginTop: '2px', textAlign: 'center'}}>Herostones | Inscriptions | Temples</span>
      </div>
      <div style={{marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginRight: '15px'}}>
        <span style={{fontSize: '1.05rem', color: '#fff', opacity: 0.85, fontWeight: 700, marginTop: '2px'}}>The Mythic Society</span>
        <span style={{fontSize: '1.05rem', color: '#fff', opacity: 0.85, fontWeight: 700, marginTop: '2px'}}>Bengaluru Inscriptions 3D Digital Conservation Project</span>
      </div>
    </nav>
  );
}

// Make NavBar available globally
window.NavBar = NavBar;
