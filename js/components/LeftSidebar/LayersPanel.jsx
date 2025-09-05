// Define LayersPanel component for use in app.js
// Note: No import/export statements for browser-based usage

function LayersPanel({ 
  basemap, 
  setBasemap, 
  opacity, 
  setOpacity, 
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
  // ...existing code...
}) {
  // Debug: log selected districts and taluks on render
  console.log('LayersPanel rendered. selectedDistricts:', selectedDistricts, 'selectedTaluks:', selectedTaluks);
  // Debug: log selected districts and taluks on render
  console.log('LayersPanel rendered. selectedDistricts:', selectedDistricts, 'selectedTaluks:', selectedTaluks);
  console.log('LayersPanel rendered. selectedDistricts:', selectedDistricts, 'selectedTaluks:', selectedTaluks);
  console.log('LayersPanel rendered. selectedDistricts:', selectedDistricts, 'selectedTaluks:', selectedTaluks);
  // Options for districts and taluks
  const districtOptions = [
    { value: "KA_Bengaluru (Rural)", label: "Bengaluru Rural" },
    { value: "KA_Bengaluru (Urban)", label: "Bengaluru Urban" },
    { value: "KA_Mandya", label: "Mandya" },
    { value: "KA_Ramanagara", label: "Ramanagara" },
    { value: "KA_Tumakuru", label: "Tumakuru" }
  ];

  // Districts for taluk selection
  const talukDistrictOptions = [
    { value: "Bengaluru_(Rural)", label: "Bengaluru (Rural)" },
    { value: "Bengaluru_(Urban)", label: "Bengaluru (Urban)" },
    { value: "Ramanagara", label: "Ramanagara" }
  ];

  // Taluks for each district
  const taluksByDistrict = {
    "Bengaluru_(Rural)": [
      "Devanahalli.geojson",
      "Doddaballapura.geojson",
      "Hoskote.geojson",
      "Nelamangala.geojson"
    ],
    "Bengaluru_(Urban)": [
      "Anekal.geojson",
      "Bangalore-East.geojson",
      "Bangalore-South.geojson",
      "Bengaluru-North.geojson",
      "Yelahanka.geojson"
    ],
    "Ramanagara": [
      "Channapatna.geojson",
      "Harohalli.geojson",
      "Kanakpura.geojson",
      "Magadi.geojson",
      "Ramanagara.geojson"
    ]
  };

  // State for selected taluk district
  const [selectedTalukDistrict, setSelectedTalukDistrict] = React.useState("");

  // Dropdown visibility state
  const [showDistrictDropdown, setShowDistrictDropdown] = React.useState(false);
  const [showTalukDropdown, setShowTalukDropdown] = React.useState(false);
  
  const handleDistrictToggle = (e) => {
    const isChecked = e.target.checked;
    setDistrictBoundariesVisible(isChecked);
    // No duplicate state/variable declarations here
  };
  
  const handleTalukToggle = (e) => {
    const isChecked = e.target.checked;
    setTalukBoundariesVisible(isChecked);
    
    // Toggle visibility of taluk layers
    if (talukLayers) {
      Object.values(talukLayers).forEach(layer => {
        if (layer) {
          if (isChecked) {
            layer.addTo(window.mapRef.current);
          } else {
            window.mapRef.current.removeLayer(layer);
          }
        }
      });
    }
  };
  
  return (
    <div style={{padding: '0.5em 0.5em 0.5em 0'}}>
      {/* Basemap Section */}
      <div style={{marginBottom: '1.2em'}}>
        <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d'}}>Basemap</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5em', marginBottom: '1em'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input type="radio" name="basemap" checked={basemap === 'default'} onChange={() => setBasemap('default')} />
            <span><i className="fa fa-map" style={{color: '#72383d'}}></i> Default</span>
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input type="radio" name="basemap" checked={basemap === 'terrain'} onChange={() => setBasemap('terrain')} />
            <span><i className="fa fa-mountain" style={{color: '#72383d'}}></i> Terrain</span>
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input type="radio" name="basemap" checked={basemap === 'satellite'} onChange={() => setBasemap('satellite')} />
            <span><i className="fa fa-globe" style={{color: '#72383d'}}></i> Satellite</span>
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input type="radio" name="basemap" checked={basemap === 'cawm'} onChange={() => setBasemap('cawm')} />
            <span><i className="fa fa-university" style={{color: '#72383d'}}></i> Ancient World (CAWM)</span>
          </label>
        </div>
      </div>

      {/* Basemap Opacity Slider */}
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2em'}}>
        <label htmlFor="basemap-opacity" style={{fontWeight: 500, color: '#72383d', minWidth: '110px', textAlign: 'left'}}>Basemap Opacity</label>
        <input
          type="range"
          id="basemap-opacity"
          name="basemap-opacity"
          min="0"
          max="100"
          value={Math.round(opacity * 100)}
          onChange={e => setOpacity(Number(e.target.value) / 100)}
          style={{flex: 1, minWidth: 0, maxWidth: '180px'}}
          aria-label="Basemap Opacity"
        />
        <span id="basemap-opacity-value" style={{width: '38px', textAlign: 'right', color: '#72383d'}}>{Math.round(opacity * 100)}%</span>
      </div>

      {/* Administrative Boundaries section */}
      <div style={{marginBottom: '1.2em'}}>
        <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d'}}>Administrative Boundaries</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5em', marginBottom: '1em'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input 
              type="checkbox" 
              id="district-boundary" 
              checked={districtBoundariesVisible}
              onChange={handleDistrictToggle}
            />
            <span><i className="fa fa-border-all" style={{color: '#72383d'}}></i> Districts</span>
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input 
              type="checkbox" 
              id="taluk-boundary" 
              checked={talukBoundariesVisible}
              onChange={handleTalukToggle}
            />
            <span><i className="fa fa-border-style" style={{color: '#72383d'}}></i> Taluks</span>
          </label>

          {/* District selector - shows when districts are visible */}
          {districtBoundariesVisible && (
            <div style={{marginLeft: '20px', marginTop: '6px'}}>
              <div style={{position: 'relative', maxWidth: '220px'}}>
                <button type="button" style={{width: '100%', textAlign: 'left', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer'}} onClick={() => setShowDistrictDropdown(v => !v)}>
                  Select Districts
                  <span style={{float: 'right'}}>&#9660;</span>
                </button>
                {showDistrictDropdown && (
                  <div style={{position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', marginTop: '2px'}}>
                    {districtOptions.map(opt => (
                      <label key={opt.value} style={{display: 'flex', alignItems: 'center', padding: '4px 8px', cursor: 'pointer'}}>
                        <input type="checkbox" checked={selectedDistricts.includes(opt.value)} onChange={e => {
                          if (e.target.checked) {
                            setSelectedDistricts([...selectedDistricts, opt.value]);
                          } else {
                            setSelectedDistricts(selectedDistricts.filter(v => v !== opt.value));
                          }
                        }} />
                        <span style={{marginLeft: '8px'}}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
                {/* Chips for selected districts */}
                <div style={{marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                  {selectedDistricts.map(val => {
                    const label = (districtOptions.find(o => o.value === val) || {}).label || val;
                    return (
                      <span key={val} style={{background: '#72383d', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '0.85em', display: 'flex', alignItems: 'center'}}>
                        {label}
                        <button type="button" style={{marginLeft: '6px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1em'}} onClick={() => setSelectedDistricts(selectedDistricts.filter(v => v !== val))}>&times;</button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Taluk selector - shows when taluks are visible */}
          {talukBoundariesVisible && (
            <div style={{marginLeft: '20px', marginTop: '6px'}}>
              {/* District dropdown for taluk selection */}
              <div style={{marginBottom: '8px'}}>
                <label style={{fontWeight: 500, marginRight: '8px'}}>Select District:</label>
                <select
                  className="form-select form-select-sm"
                  style={{maxWidth: '220px', display: 'inline-block'}}
                  value={selectedTalukDistrict}
                  onChange={e => {
                    setSelectedTalukDistrict(e.target.value);
                    setSelectedTaluks([]); // Reset taluk selection when district changes
                  }}
                >
                  <option value="">-- Select District --</option>
                  {talukDistrictOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Taluk dropdown for selected district */}
              {selectedTalukDistrict && (
                <div style={{position: 'relative', maxWidth: '220px'}}>
                  <button type="button" style={{width: '100%', textAlign: 'left', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer'}} onClick={() => setShowTalukDropdown(v => !v)}>
                    Select Taluks
                    <span style={{float: 'right'}}>&#9660;</span>
                  </button>
                  {showTalukDropdown && (
                    <div style={{position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', marginTop: '2px'}}>
                      {taluksByDistrict[selectedTalukDistrict].map(taluk => {
                        const isChecked = selectedTaluks.some(sel => sel.taluk === taluk && sel.district === selectedTalukDistrict);
                        return (
                          <label key={taluk} style={{display: 'flex', alignItems: 'center', padding: '4px 8px', cursor: 'pointer'}}>
                            <input type="checkbox" checked={isChecked} onChange={e => {
                              if (e.target.checked) {
                                setSelectedTaluks([...selectedTaluks, { district: selectedTalukDistrict, taluk }]);
                              } else {
                                setSelectedTaluks(selectedTaluks.filter(sel => !(sel.taluk === taluk && sel.district === selectedTalukDistrict)));
                              }
                            }} />
                            <span style={{marginLeft: '8px'}}>{taluk.replace(/-/g, ' ')}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {/* Chips for selected taluks */}
                  <div style={{marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {selectedTaluks.map(sel => (
                      <span key={sel.district + sel.taluk} style={{background: '#72383d', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '0.85em', display: 'flex', alignItems: 'center'}}>
                        {sel.taluk.replace('.geojson','').replace(/-/g, ' ')} <span style={{marginLeft: '6px', fontSize: '0.8em', color: '#ffd200'}}>{sel.district}</span>
                        <button type="button" style={{marginLeft: '6px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1em'}} onClick={() => setSelectedTaluks(selectedTaluks.filter(v => !(v.taluk === sel.taluk && v.district === sel.district)))}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Make LayersPanel available globally
window.LayersPanel = LayersPanel;
