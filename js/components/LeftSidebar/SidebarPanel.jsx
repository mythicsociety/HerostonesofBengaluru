// SidebarPanel component for WebGIS application

function SidebarPanel({
  showHerostones, setShowHerostones,
  showTemples, setShowTemples,
  showInscriptions, setShowInscriptions,
  opacity, setOpacity,
  basemap, setBasemap,
  clusteringHerostones, setClusteringHerostones,
  clusteringInscriptions, setClusteringInscriptions,
  clusteringTemples, setClusteringTemples,
  herostoneColor, setHerostoneColor,
  herostoneSize, setHerostoneSize,
  herostoneOpacity, setHerostoneOpacity,
  inscriptionColor, setInscriptionColor,
  inscriptionSize, setInscriptionSize,
  inscriptionOpacity, setInscriptionOpacity,
  templeColor, setTempleColor,
  templeSize, setTempleSize,
  templeOpacity, setTempleOpacity,
  // Administrative boundaries props
  districtLayers,
  talukLayers,
  districtBoundariesVisible, 
  setDistrictBoundariesVisible,
  talukBoundariesVisible, 
  setTalukBoundariesVisible,
  selectedDistricts,
  setSelectedDistricts,
  selectedTaluks,
  setSelectedTaluks
}) {
  return (
    <div id="leaflet-sidebar" className="leaflet-sidebar collapsed">
      <div className="leaflet-sidebar-tabs">
        <ul role="tablist">
          <li><a href="#site" role="tab"><i className="fa fa-database"></i></a></li>
          <li><a href="#filters" role="tab"><i className="fa fa-filter"></i></a></li>
          <li><a href="#layers" role="tab"><i className="fa fa-layer-group"></i></a></li>
          <li><a href="#draw" role="tab"><i className="fa fa-draw-polygon"></i></a></li>
          {/* Move Feedback tab to the bottom */}
        </ul>
        <ul role="tablist" style={{position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'none', border: 'none', margin: 0, padding: 0, display: 'flex', justifyContent: 'flex-end'}}>
          <li><a href="#feedback" role="tab"><i className="fa fa-envelope"></i></a></li>
        </ul>
      </div>
      <div className="leaflet-sidebar-content">
        <div className="leaflet-sidebar-pane" id="site">
          <h1 className="leaflet-sidebar-header">Data Selection<span className="leaflet-sidebar-close"></span></h1>
          <div style={{padding: '0.5em 0.5em 0.5em 0'}}>
            {/* Features Section */}
            <div style={{marginBottom: '1.2em'}}>
              <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d'}}>Features</div>
              {(() => {
                const [openPanel, setOpenPanel] = React.useState(null);
                const rowStyle = {display: 'grid', gridTemplateColumns: '28px 1fr 32px 48px', alignItems: 'center', gap: '0 10px', position: 'relative', minHeight: 36};
                const iconBtnStyle = {background: 'none', border: 'none', cursor: 'pointer', margin: 0, padding: 0, color: '#72383d', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 28, width: 28};
                return (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {/* Herostones row */}
                    <div style={rowStyle}>
                      <input id="herostones-toggle" name="herostones-toggle" type="checkbox" checked={showHerostones} onChange={e => setShowHerostones(e.target.checked)} aria-label="Show Herostones" />
                      <span style={{display: 'flex', alignItems: 'center'}}>
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}>
                          <circle cx="9" cy="9" r="8" fill="#72383d" />
                        </svg>
                        Herostones
                      </span>
                      <button style={iconBtnStyle} title="Customize Herostones" onClick={() => setOpenPanel(openPanel === 'herostone' ? null : 'herostone')}><i className="fa fa-cog"></i></button>
                      <label className="switch" style={{marginBottom: 0, marginLeft: 'auto'}} title="Toggle clustering for Herostones">
                        <input type="checkbox" checked={clusteringHerostones} onChange={e => setClusteringHerostones(e.target.checked)} />
                        <span className="slider round"></span>
                      </label>
                      {openPanel === 'herostone' && (
                        <div id="herostone-custom-popup" style={{position: 'fixed', left: (document.getElementById('leaflet-sidebar')?.offsetWidth || 70) + 16, top: 140, zIndex: 2000, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 240, maxWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', maxHeight: 350, overflowY: 'auto'}}>
                          <div style={{marginBottom: 10}}><b>Herostones Customization</b></div>
                          <div style={{marginBottom: 10}}>
                            <label style={{fontWeight: 'bold', color: '#72383d', marginRight: 8}}>Color:</label>
                            {COLOR_OPTIONS && COLOR_OPTIONS.map((opt, idx) => (
                              <button key={opt.name} style={{width: 24, height: 24, borderRadius: '50%', border: herostoneColor === idx ? '2px solid #333' : '1px solid #bbb', background: opt.gradient, cursor: 'pointer', marginRight: 4}} onClick={() => setHerostoneColor(idx)} title={opt.name} />
                            ))}
                          </div>
                          <div style={{marginBottom: 10}}>
                            <label style={{fontWeight: 500, color: '#72383d', minWidth: '90px'}}>Size</label>
                            <input type="range" min="8" max="36" value={herostoneSize} onChange={e => setHerostoneSize(Number(e.target.value))} style={{width: 100}} />
                            <span style={{marginLeft: 8}}>{herostoneSize}px</span>
                          </div>
                          <div>
                            <label style={{fontWeight: 500, color: '#72383d', minWidth: '90px'}}>Opacity</label>
                            <input type="range" min="10" max="100" value={Math.round(herostoneOpacity * 100)} onChange={e => setHerostoneOpacity(Number(e.target.value) / 100)} style={{width: 100}} />
                            <span style={{marginLeft: 8}}>{Math.round(herostoneOpacity * 100)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Inscriptions row */}
                    <div style={rowStyle}>
                      <input id="inscriptions-toggle" name="inscriptions-toggle" type="checkbox" checked={showInscriptions} onChange={e => setShowInscriptions(e.target.checked)} aria-label="Show Inscriptions" />
                      <span style={{display: 'flex', alignItems: 'center'}}>
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}>
                          <rect x="3" y="3" width="12" height="12" fill="#72383d" />
                        </svg>
                        Inscriptions
                      </span>
                      <button style={iconBtnStyle} title="Customize Inscriptions" onClick={() => setOpenPanel(openPanel === 'inscription' ? null : 'inscription')}><i className="fa fa-cog"></i></button>
                      <label className="switch" style={{marginBottom: 0, marginLeft: 'auto'}} title="Toggle clustering for Inscriptions">
                        <input type="checkbox" checked={clusteringInscriptions} onChange={e => setClusteringInscriptions(e.target.checked)} />
                        <span className="slider round"></span>
                      </label>
                      {openPanel === 'inscription' && (
                        <div id="inscription-custom-popup" style={{position: 'fixed', left: (document.getElementById('leaflet-sidebar')?.offsetWidth || 70) + 16, top: 140, zIndex: 2000, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 240, maxWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', maxHeight: 350, overflowY: 'auto'}}>
                          <div style={{marginBottom: 10}}><b>Inscriptions Customization</b></div>
                          <div style={{marginBottom: 10}}>
                            <label style={{fontWeight: 'bold', color: '#72383d', marginRight: 8}}>Color:</label>
                            {COLOR_OPTIONS && COLOR_OPTIONS.map((opt, idx) => (
                              <button key={opt.name} style={{width: 24, height: 24, borderRadius: '50%', border: inscriptionColor === idx ? '2px solid #333' : '1px solid #bbb', background: opt.gradient, cursor: 'pointer', marginRight: 4}} onClick={() => setInscriptionColor(idx)} title={opt.name} />
                            ))}
                          </div>
                          <div style={{marginBottom: 10}}>
                            <label style={{fontWeight: 500, color: '#72383d', minWidth: '90px'}}>Size</label>
                            <input type="range" min="8" max="36" value={inscriptionSize} onChange={e => setInscriptionSize(Number(e.target.value))} style={{width: 100}} />
                            <span style={{marginLeft: 8}}>{inscriptionSize}px</span>
                          </div>
                          <div>
                            <label style={{fontWeight: 500, color: '#72383d', minWidth: '90px'}}>Opacity</label>
                            <input type="range" min="10" max="100" value={Math.round(inscriptionOpacity * 100)} onChange={e => setInscriptionOpacity(Number(e.target.value) / 100)} style={{width: 100}} />
                            <span style={{marginLeft: 8}}>{Math.round(inscriptionOpacity * 100)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Temples row */}
                    <div style={rowStyle}>
                      <input id="temples-toggle" name="temples-toggle" type="checkbox" checked={showTemples} onChange={e => setShowTemples(e.target.checked)} aria-label="Show Ancient Temples" />
                      <span style={{display: 'flex', alignItems: 'center'}}>
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}>
                          <polygon points="9,2 16,6.5 16,14 9,17 2,14 2,6.5" fill="#72383d" />
                        </svg>
                        Ancient Temples
                      </span>
                      <button style={iconBtnStyle} title="Customize Temples" onClick={() => setOpenPanel(openPanel === 'temple' ? null : 'temple')}><i className="fa fa-cog"></i></button>
                      <label className="switch" style={{marginBottom: 0, marginLeft: 'auto'}} title="Toggle clustering for Temples">
                        <input type="checkbox" checked={clusteringTemples} onChange={e => setClusteringTemples(e.target.checked)} />
                        <span className="slider round"></span>
                      </label>
                      {openPanel === 'temple' && (
                        <div id="temple-custom-popup" style={{position: 'fixed', left: (document.getElementById('leaflet-sidebar')?.offsetWidth || 70) + 16, top: 140, zIndex: 2000, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 240, maxWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', maxHeight: 350, overflowY: 'auto'}}>
                          <div style={{marginBottom: 10}}><b>Temples Customization</b></div>
                          <div style={{marginBottom: 10}}>
                            <label style={{fontWeight: 'bold', color: '#72383d', marginRight: 8}}>Color:</label>
                            {COLOR_OPTIONS && COLOR_OPTIONS.map((opt, idx) => (
                              <button key={opt.name} style={{width: 24, height: 24, borderRadius: '50%', border: templeColor === idx ? '2px solid #333' : '1px solid #bbb', background: opt.gradient, cursor: 'pointer', marginRight: 4}} onClick={() => setTempleColor(idx)} title={opt.name} />
                            ))}
                          </div>
                          <div style={{marginBottom: 10}}>
                            <label style={{fontWeight: 500, color: '#72383d', minWidth: '90px'}}>Size</label>
                            <input type="range" min="8" max="36" value={templeSize} onChange={e => setTempleSize(Number(e.target.value))} style={{width: 100}} />
                            <span style={{marginLeft: 8}}>{templeSize}px</span>
                          </div>
                          <div>
                            <label style={{fontWeight: 500, color: '#72383d', minWidth: '90px'}}>Opacity</label>
                            <input type="range" min="10" max="100" value={Math.round(templeOpacity * 100)} onChange={e => setTempleOpacity(Number(e.target.value) / 100)} style={{width: 100}} />
                            <span style={{marginLeft: 8}}>{Math.round(templeOpacity * 100)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        <div className="leaflet-sidebar-pane" id="filters">
          <h1 className="leaflet-sidebar-header">Filters<span className="leaflet-sidebar-close"></span></h1>
          {window.FiltersPanel && React.createElement(window.FiltersPanel, {
            selectedDistricts,
            setSelectedDistricts,
            selectedTaluks,
            setSelectedTaluks
          })}
        </div>
        <div className="leaflet-sidebar-pane" id="layers">
          <h1 className="leaflet-sidebar-header">Layers<span className="leaflet-sidebar-close"></span></h1>
          <LayersPanel 
            basemap={basemap} 
            setBasemap={setBasemap} 
            opacity={opacity} 
            setOpacity={setOpacity} 
            districtLayers={districtLayers}
            talukLayers={talukLayers}
            districtBoundariesVisible={districtBoundariesVisible}
            setDistrictBoundariesVisible={setDistrictBoundariesVisible}
            talukBoundariesVisible={talukBoundariesVisible}
            setTalukBoundariesVisible={setTalukBoundariesVisible}
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
            selectedTaluks={selectedTaluks}
            setSelectedTaluks={setSelectedTaluks}
          />
        </div>
        <div className="leaflet-sidebar-pane" id="draw">
          <h1 className="leaflet-sidebar-header">Spatial Filters<span className="leaflet-sidebar-close"></span></h1>
          <div style={{padding: '0 0.75em 1em 0'}}>
            <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d'}}>Draw Buffer Zone</div>
            <div className="mb-3">
              <label style={{fontWeight: 500, display: 'block', marginBottom: '0.25em', fontSize: '0.95em'}}>Select Method</label>
              <div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="draw-method" id="draw-method-random" defaultChecked={true} />
                  <label className="form-check-label" htmlFor="draw-method-random">
                    Click on Map
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="draw-method" id="draw-method-coord" />
                  <label className="form-check-label" htmlFor="draw-method-coord">
                    Enter Coordinates
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-3" id="draw-coord-fields" style={{display: 'none'}}>
              <div className="row g-2 mb-2">
                <div className="col">
                  <input type="text" className="form-control form-control-sm" id="draw-lat" placeholder="Latitude" />
                </div>
                <div className="col">
                  <input type="text" className="form-control form-control-sm" id="draw-lng" placeholder="Longitude" />
                </div>
                <div className="col-auto">
                  <button className="btn btn-sm btn-theme" style={{height: '31px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '31px', padding: 0}}>
                    <i className="fa fa-location-dot"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="leaflet-sidebar-pane" id="feedback">
          <h1 className="leaflet-sidebar-header">Feedback<span className="leaflet-sidebar-close"></span></h1>
          <div className="p-3">
            <h5>Share Your Feedback</h5>
            <p>We value your input to improve this WebGIS application.</p>
            <form id="feedback-form">
              <div className="mb-3">
                <label htmlFor="feedback-email" className="form-label">Email</label>
                <input type="email" className="form-control" id="feedback-email" placeholder="Your email (optional)" />
              </div>
              <div className="mb-3">
                <label htmlFor="feedback-type" className="form-label">Feedback Type</label>
                <select className="form-select" id="feedback-type">
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="data">Data Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="feedback-text" className="form-label">Your Feedback</label>
                <textarea className="form-control" id="feedback-text" rows="3" placeholder="Please describe your feedback in detail"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Feedback</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Make SidebarPanel available globally
window.SidebarPanel = SidebarPanel;
