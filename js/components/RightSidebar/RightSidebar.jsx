// RightSidebar component for WebGIS application
// No import/export statements for browser-based usage

function RightSidebar({ 
  selectedSite, 
  data, 
  show, 
  onClose, 
  herostones = [], 
  inscriptions = [], 
  temples = [], 
  showHerostones = true, 
  showInscriptions = true, 
  showTemples = true, 
  setSelectedSite, 
  highlightMapFeature, 
  spatialFilterVersion = 0, 
  sidebarWidth = 350, 
  setSidebarWidth 
}) {
  const [activeTab, setActiveTab] = React.useState('about');
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = React.useState({herostones: true, inscriptions: true, temples: true});
  
  React.useEffect(() => {
    if (selectedSite) setActiveTab('about');
  }, [selectedSite]);
  
  React.useEffect(() => {
    setFeaturesDropdownOpen({herostones: false, inscriptions: false, temples: false});
  }, [spatialFilterVersion]);
  
  const showDefault = !selectedSite;
  const isTemple = selectedSite && selectedSite["Temple"];
  
  // Filter features by spatial clip (polygon) if present
  let turfRef = window.turf || window.Turf || null;
  let filterPoly = window.spatialFilterPoly && window.spatialFilterPoly.current;
  if (filterPoly && !turfRef && typeof turf !== 'undefined') turfRef = turf;
  
  function isInsideClip(item, type) {
    if (!filterPoly || !turfRef) return true;
    let lat, lng;
    if (type === 'temple') {
      lat = item.Latitude ?? item.latitude ?? item.Lat ?? item.lat;
      lng = item.Longitude ?? item.longitude ?? item.Lon ?? item.lon ?? item.Long ?? item.lng;
    } else {
      lat = item.Lat ?? item.lat ?? item.latitude ?? item.Latitude;
      lng = item.Long ?? item.Lng ?? item.lng ?? item.lon ?? item.Lon ?? item.longitude ?? item.Longitude;
    }
    if (typeof lat === 'string') lat = parseFloat(lat);
    if (typeof lng === 'string') lng = parseFloat(lng);
    if (isNaN(lat) || isNaN(lng)) return false;
    const pt = turfRef.point([lng, lat]);
    return turfRef.booleanPointInPolygon(pt, filterPoly);
  }
  
  const filteredHerostones = showHerostones ? herostones.filter(h => isInsideClip(h, 'herostone')) : [];
  const filteredInscriptions = showInscriptions ? inscriptions.filter(i => isInsideClip(i, 'inscription')) : [];
  const filteredTemples = showTemples ? temples.filter(t => isInsideClip(t, 'temple')) : [];
  
  // Sidebar width state for resizable sidebar
  const sidebarRef = React.useRef(null);
  
  // Drag logic
  React.useEffect(() => {
    const handleMouseMove = e => {
      if (window._sidebarResizing) {
        const newWidth = Math.max(250, Math.min(700, window.innerWidth - e.clientX));
        if (typeof setSidebarWidth === 'function') setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => { window._sidebarResizing = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setSidebarWidth]);
  
  return (
    <div ref={sidebarRef} className={`offcanvas offcanvas-end${show ? ' show' : ''}`} tabIndex="-1" style={{visibility: show ? 'visible' : 'hidden', width: sidebarWidth, zIndex: 1050, height: '100vh', display: 'flex', flexDirection: 'column', transition: 'width 0.1s'}}>
      {/* Draggable resizer bar */}
      <div
        style={{position: 'absolute', left: -6, top: 0, width: 12, height: '100%', cursor: 'ew-resize', zIndex: 1100, background: 'transparent'}}
        onMouseDown={e => { window._sidebarResizing = true; e.preventDefault(); }}
        title="Drag to resize sidebar"
      />
      <div className="offcanvas-header" style={{flex: '0 0 auto'}}>
        <h5 className="offcanvas-title">Heritage Info</h5>
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body p-0" style={{flex: '1 1 auto', overflowY: 'auto', minHeight: 0}}>
        <ul className="nav nav-tabs" id="sidebarTabs" role="tablist" aria-label="Sidebar Tabs">
          <li className="nav-item" role="presentation" style={{flex: 1, minWidth: 0}}>
            <button className={`nav-link${activeTab === 'about' ? ' active' : ''}`} id="about-tab" type="button" role="tab" aria-selected={activeTab === 'about'} aria-controls="about-panel" tabIndex={activeTab === 'about' ? 0 : -1} onClick={() => setActiveTab('about')} style={{fontSize: '0.97em', padding: '6px 8px', minWidth: 0, width: '100%'}}>About</button>
          </li>
          <li className="nav-item" role="presentation" style={{flex: 1, minWidth: 0}}>
            <button className={`nav-link${activeTab === 'features' ? ' active' : ''}`} id="features-tab" type="button" role="tab" aria-selected={activeTab === 'features'} aria-controls="features-panel" tabIndex={activeTab === 'features' ? 0 : -1} onClick={() => setActiveTab('features')} style={{fontSize: '0.97em', padding: '6px 8px', minWidth: 0, width: '100%'}}>Features</button>
          </li>
          <li className="nav-item" role="presentation" style={{flex: 1, minWidth: 0}}>
            <button className={`nav-link${activeTab === 'wiki' ? ' active' : ''}`} id="wiki-tab" type="button" role="tab" aria-selected={activeTab === 'wiki'} aria-controls="wiki-panel" tabIndex={activeTab === 'wiki' ? 0 : -1} onClick={() => setActiveTab('wiki')} style={{fontSize: '0.97em', padding: '6px 8px', minWidth: 0, width: '100%'}}>Wikipedia</button>
          </li>
          <li className="nav-item" role="presentation" style={{flex: 1, minWidth: 0}}>
            <button className={`nav-link${activeTab === 'photos' ? ' active' : ''}`} id="photos-tab" type="button" role="tab" aria-selected={activeTab === 'photos'} aria-controls="photos-panel" tabIndex={activeTab === 'photos' ? 0 : -1} onClick={() => setActiveTab('photos')} style={{fontSize: '0.97em', padding: '6px 8px', minWidth: 0, width: '100%'}}>Photos</button>
          </li>
        </ul>
        <div className="tab-content p-3" id="sidebarTabsContent">
          {activeTab === 'features' && (
            <div className="tab-pane fade show active" id="features-panel" role="tabpanel" aria-labelledby="features-tab">
              <div style={{marginBottom: '0.5em', color: '#888', fontSize: '10pt'}}>All visible map points are listed below. Click to highlight on the map.</div>
              {/* Features Dropdowns */}
              <div>
                {/* Herostones Dropdown */}
                <div style={{marginBottom: 8}}>
                  <div style={{cursor: 'pointer', fontWeight: 500, color: '#72383d', display: 'flex', alignItems: 'center'}} onClick={() => setFeaturesDropdownOpen(o => ({...o, herostones: !o.herostones}))}>
                    <span style={{marginRight: 6}}>{featuresDropdownOpen.herostones ? '▼' : '►'}</span>Herostones ({showHerostones ? filteredHerostones.length : 0})
                  </div>
                  {featuresDropdownOpen.herostones && showHerostones && (
                    <ul key={spatialFilterVersion + '-herostones'} style={{listStyle: 'none', margin: 0, padding: '4px 0 4px 16px'}}>
                      {filteredHerostones.map((h, idx) => (
                        <li key={h.id || idx} style={{cursor: 'pointer', padding: '2px 0', color: '#333'}} onClick={() => highlightMapFeature('herostone', h, idx)}>
                          {h.name || h.Site || h.Temple || h.Inscription || `Herostone #${idx+1}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Inscriptions Dropdown */}
                <div style={{marginBottom: 8}}>
                  <div style={{cursor: 'pointer', fontWeight: 500, color: '#72383d', display: 'flex', alignItems: 'center'}} onClick={() => setFeaturesDropdownOpen(o => ({...o, inscriptions: !o.inscriptions}))}>
                    <span style={{marginRight: 6}}>{featuresDropdownOpen.inscriptions ? '▼' : '►'}</span>Inscriptions ({showInscriptions ? filteredInscriptions.length : 0})
                  </div>
                  {featuresDropdownOpen.inscriptions && showInscriptions && (
                    <ul key={spatialFilterVersion + '-inscriptions'} style={{listStyle: 'none', margin: 0, padding: '4px 0 4px 16px'}}>
                      {filteredInscriptions.map((i, idx) => (
                        <li key={i.id || idx} style={{cursor: 'pointer', padding: '2px 0', color: '#333'}} onClick={() => highlightMapFeature('inscription', i, idx)}>
                          {i.name || i.Site || i.Temple || i.Inscription || `Inscription #${idx+1}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Temples Dropdown */}
                <div style={{marginBottom: 8}}>
                  <div style={{cursor: 'pointer', fontWeight: 500, color: '#72383d', display: 'flex', alignItems: 'center'}} onClick={() => setFeaturesDropdownOpen(o => ({...o, temples: !o.temples}))}>
                    <span style={{marginRight: 6}}>{featuresDropdownOpen.temples ? '▼' : '►'}</span>Temples ({showTemples ? filteredTemples.length : 0})
                  </div>
                  {featuresDropdownOpen.temples && showTemples && (
                    <ul key={spatialFilterVersion + '-temples'} style={{listStyle: 'none', margin: 0, padding: '4px 0 4px 16px'}}>
                      {filteredTemples.map((t, idx) => (
                        <li key={t.id || idx} style={{cursor: 'pointer', padding: '2px 0', color: '#333'}} onClick={() => highlightMapFeature('temple', t, idx)}>
                          {t.name || t.Site || t.Temple || t.Inscription || `Temple #${idx+1}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Infographic/Chart for visible features */}
              <div style={{marginTop: 16, marginBottom: 8}}>
                <div style={{fontWeight: 600, color: '#72383d', marginBottom: 4}}>Infographic</div>
                <div style={{fontWeight: 500, color: '#555', fontSize: '1em', marginBottom: 6, textAlign: 'center'}}>Visible Heritage Features</div>
                {window.ChartComponent && (
                  <window.ChartComponent 
                    data={[
                      { name: 'Herostones', value: filteredHerostones.length }, 
                      { name: 'Inscriptions', value: filteredInscriptions.length }, 
                      { name: 'Temples', value: filteredTemples.length }
                    ]}
                  />
                )}
              </div>
            </div>
          )}
          {activeTab === 'about' && (
            <div className="tab-pane fade show active" id="about-panel" role="tabpanel" aria-labelledby="about-tab">
              {showDefault ? (
                <>
                  <h6>About The Mythic Society</h6>
                  <p>The Mythic Society is a historic academic institution in Bengaluru, founded in 1909, dedicated to research and preservation of Indian history, culture, and heritage.</p>
                  <p><b>Bengaluru Inscriptions 3D Digital Conservation Project:</b> Digitally conserves 1500 ancient stone inscriptions from Bengaluru and Ramanagara, making them accessible for research and public knowledge.</p>
                  <p><b>Akshara Bhandara:</b> A digital gateway to the rich world of ancient Kannada scripts, offering interactive tools, 3D scans, and educational resources for inscription studies.</p>
                </>
              ) : isTemple && window.templeSidebarHtml ? (
                // Sanitize HTML before rendering to prevent XSS
                <div dangerouslySetInnerHTML={{__html: window.DOMPurify ? window.DOMPurify.sanitize(window.templeSidebarHtml) : ''}} />
              ) : (
                <>
                  <h6>Feature Details</h6>
                  <div style={{maxHeight: '350px', overflow: 'auto'}}>
                    <table className="table table-sm table-bordered" style={{fontSize: '0.97em'}}>
                      <tbody>
                        {Object.entries(selectedSite).map(([key, value]) => (
                          <tr key={key}>
                            <th style={{verticalAlign: 'top', minWidth: 120}}>{key}</th>
                            <td>{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'wiki' && (
            <div className="tab-pane fade show active" id="wiki-panel" role="tabpanel" aria-labelledby="wiki-tab">
              {showDefault ? (
                <>
                  <p><a href="https://en.wikipedia.org/wiki/Daly_Memorial_Hall#Mythic_society" target="_blank" rel="noopener noreferrer">The Mythic Society Wikipedia</a></p>
                  <p><a href="https://www.wikidata.org/wiki/Q5211784" target="_blank" rel="noopener noreferrer">Wikidata: Q5211784</a></p>
                </>
              ) : (
                <p>Wikipedia info coming soon.</p>
              )}
            </div>
          )}
          {activeTab === 'photos' && (
            <div className="tab-pane fade show active" id="photos-panel" role="tabpanel" aria-labelledby="photos-tab">
              {showDefault ? (
                <>
                  <img src="https://mythicsociety.org/bsms_ci/assets/uploads/banner/p1.jpg" alt="Mythic Society Building" style={{width:'100%', marginBottom: '8px', borderRadius: '6px'}} />
                  <img src="https://mythicsociety.github.io/AksharaBhandara/assets/Home-image.png" alt="Akshara Bhandara" style={{width:'100%', marginBottom: '8px', borderRadius: '6px'}} />
                  <img src="https://mythicsociety.org/bsms_ci/assets/uploads/banner/talegari.JPG" alt="Inscriptions Project" style={{width:'100%', borderRadius: '6px'}} />
                </>
              ) : (
                <p>Photos coming soon.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Make RightSidebar available globally
window.RightSidebar = RightSidebar;
