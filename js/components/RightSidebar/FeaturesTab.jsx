import React, { useState } from 'react';

function FeaturesTab({
  filteredHerostones,
  filteredInscriptions,
  filteredTemples,
  showHerostones,
  showInscriptions,
  showTemples,
  spatialFilterVersion,
  handleItemClick
}) {
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState({
    herostones: true, 
    inscriptions: true, 
    temples: true
  });
  
  return (
    <>
      <div style={{marginBottom: '0.5em', color: '#888', fontSize: '10pt'}}>All visible map points are listed below. Click to highlight on the map.</div>
      
      {/* Features Dropdowns */}
      <div>
        {/* Herostones Dropdown */}
        <div style={{marginBottom: 8}}>
          <div 
            style={{
              cursor: 'pointer', 
              fontWeight: 500, 
              color: '#72383d', 
              display: 'flex', 
              alignItems: 'center'
            }} 
            onClick={() => setFeaturesDropdownOpen(o => ({
              ...o, 
              herostones: !o.herostones
            }))}
          >
            <span style={{marginRight: 6}}>
              {featuresDropdownOpen.herostones ? '▼' : '►'}
            </span>
            Herostones ({showHerostones ? filteredHerostones.length : 0})
          </div>
          
          {featuresDropdownOpen.herostones && showHerostones && (
            <ul 
              key={spatialFilterVersion + '-herostones'} 
              style={{
                listStyle: 'none', 
                margin: 0, 
                padding: '4px 0 4px 16px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {filteredHerostones.length > 0 ? 
                filteredHerostones.map((h, idx) => (
                  <li 
                    key={h.id || idx} 
                    style={{
                      cursor: 'pointer', 
                      padding: '2px 0', 
                      color: '#333'
                    }} 
                    onClick={() => handleItemClick('herostone', h, idx)}
                  >
                    {h.name || h.Site || h.Temple || h.Inscription || `Herostone #${idx+1}`}
                  </li>
                )) : 
                <li style={{color: '#888', fontStyle: 'italic'}}>No herostones visible</li>
              }
            </ul>
          )}
        </div>
        
        {/* Inscriptions Dropdown */}
        <div style={{marginBottom: 8}}>
          <div 
            style={{
              cursor: 'pointer', 
              fontWeight: 500, 
              color: '#72383d', 
              display: 'flex', 
              alignItems: 'center'
            }} 
            onClick={() => setFeaturesDropdownOpen(o => ({
              ...o, 
              inscriptions: !o.inscriptions
            }))}
          >
            <span style={{marginRight: 6}}>
              {featuresDropdownOpen.inscriptions ? '▼' : '►'}
            </span>
            Inscriptions ({showInscriptions ? filteredInscriptions.length : 0})
          </div>
          
          {featuresDropdownOpen.inscriptions && showInscriptions && (
            <ul 
              key={spatialFilterVersion + '-inscriptions'} 
              style={{
                listStyle: 'none', 
                margin: 0, 
                padding: '4px 0 4px 16px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {filteredInscriptions.length > 0 ? 
                filteredInscriptions.map((i, idx) => (
                  <li 
                    key={i.id || idx} 
                    style={{
                      cursor: 'pointer', 
                      padding: '2px 0', 
                      color: '#333'
                    }} 
                    onClick={() => handleItemClick('inscription', i, idx)}
                  >
                    {i.name || i.Site || i.Temple || i.Inscription || `Inscription #${idx+1}`}
                  </li>
                )) : 
                <li style={{color: '#888', fontStyle: 'italic'}}>No inscriptions visible</li>
              }
            </ul>
          )}
        </div>
        
        {/* Temples Dropdown */}
        <div style={{marginBottom: 8}}>
          <div 
            style={{
              cursor: 'pointer', 
              fontWeight: 500, 
              color: '#72383d', 
              display: 'flex', 
              alignItems: 'center'
            }} 
            onClick={() => setFeaturesDropdownOpen(o => ({
              ...o, 
              temples: !o.temples
            }))}
          >
            <span style={{marginRight: 6}}>
              {featuresDropdownOpen.temples ? '▼' : '►'}
            </span>
            Temples ({showTemples ? filteredTemples.length : 0})
          </div>
          
          {featuresDropdownOpen.temples && showTemples && (
            <ul 
              key={spatialFilterVersion + '-temples'} 
              style={{
                listStyle: 'none', 
                margin: 0, 
                padding: '4px 0 4px 16px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {filteredTemples.length > 0 ? 
                filteredTemples.map((t, idx) => (
                  <li 
                    key={t.id || idx} 
                    style={{
                      cursor: 'pointer', 
                      padding: '2px 0', 
                      color: '#333'
                    }} 
                    onClick={() => handleItemClick('temple', t, idx)}
                  >
                    {t.name || t.Site || t.Temple || t.Inscription || `Temple #${idx+1}`}
                  </li>
                )) : 
                <li style={{color: '#888', fontStyle: 'italic'}}>No temples visible</li>
              }
            </ul>
          )}
        </div>
      </div>
      
      {/* Statistics */}
      <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '5px'}}>
        <h6 style={{color: '#72383d', marginBottom: '10px'}}>Feature Statistics</h6>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>Total Features:</div>
            <div style={{fontWeight: 'bold'}}>Visible:</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div>
              {(showHerostones ? filteredHerostones.length : 0) + 
               (showInscriptions ? filteredInscriptions.length : 0) + 
               (showTemples ? filteredTemples.length : 0)}
            </div>
            <div>
              {(showHerostones ? filteredHerostones.length : 0) + 
               (showInscriptions ? filteredInscriptions.length : 0) + 
               (showTemples ? filteredTemples.length : 0)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeaturesTab;
