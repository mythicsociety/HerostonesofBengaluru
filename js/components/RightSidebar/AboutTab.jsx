import React from 'react';

function AboutTab({ showDefault, isTemple, selectedSite }) {
  return (
    <>
      {showDefault ? (
        <>
          <h6>About The Mythic Society</h6>
          <p>The Mythic Society is a historic academic institution in Bengaluru, founded in 1909, dedicated to research and preservation of Indian history, culture, and heritage.</p>
          <p><b>Bengaluru Inscriptions 3D Digital Conservation Project:</b> Digitally conserves 1500 ancient stone inscriptions from Bengaluru and Ramanagara, making them accessible for research and public knowledge.</p>
          <p><b>Akshara Bhandara:</b> A digital gateway to the rich world of ancient Kannada scripts, offering interactive tools, 3D scans, and educational resources for inscription studies.</p>
          
          <h6 style={{marginTop: '20px'}}>Heritage Mapping Project</h6>
          <p>This interactive map showcases various heritage sites across Bengaluru and surrounding regions, including:</p>
          <ul>
            <li><b>Herostones (Veeragallu):</b> Memorial stones erected to commemorate heroes who died in battle</li>
            <li><b>Inscriptions:</b> Ancient stone inscriptions dating back several centuries</li>
            <li><b>Temples:</b> Historical temples with cultural and architectural significance</li>
          </ul>
          <p>The project aims to document, preserve, and promote awareness of these important cultural assets.</p>
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
                {Object.entries(selectedSite || {}).map(([key, value]) => (
                  key !== 'geometry' && key !== 'id' && key !== 'type' && (
                    <tr key={key}>
                      <th style={{verticalAlign: 'top', minWidth: 120}}>{key}</th>
                      <td>{String(value)}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Additional info section if available */}
          {selectedSite?.Description && (
            <div style={{marginTop: '20px'}}>
              <h6>Description</h6>
              <p>{selectedSite.Description}</p>
            </div>
          )}
          
          {/* Historical context if available */}
          {selectedSite?.["Historical Context"] && (
            <div style={{marginTop: '20px'}}>
              <h6>Historical Context</h6>
              <p>{selectedSite["Historical Context"]}</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default AboutTab;
