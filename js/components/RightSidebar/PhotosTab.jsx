import React from 'react';

function PhotosTab({ showDefault, selectedSite }) {
  // This would come from your actual data
  const getPhotoUrls = (site) => {
    if (!site) return [];
    
    // Example: return photo URLs based on site properties
    // In a real implementation, you would fetch these from your data
    if (site.Photos) {
      return Array.isArray(site.Photos) ? site.Photos : [site.Photos];
    }
    
    if (site["Photo URL"]) {
      return [site["Photo URL"]];
    }
    
    // Default placeholder images based on feature type
    if (site.Temple) {
      return [
        "https://mythicsociety.org/bsms_ci/assets/uploads/banner/temple_placeholder.jpg"
      ];
    } else if (site.Inscription) {
      return [
        "https://mythicsociety.org/bsms_ci/assets/uploads/banner/inscription_placeholder.jpg"
      ];
    } else {
      return [
        "https://mythicsociety.org/bsms_ci/assets/uploads/banner/herostone_placeholder.jpg"
      ];
    }
    
    return [];
  };
  
  const photos = selectedSite ? getPhotoUrls(selectedSite) : [];

  return (
    <>
      {showDefault ? (
        <>
          <h6>Featured Photos</h6>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <img 
              src="https://mythicsociety.org/bsms_ci/assets/uploads/banner/p1.jpg" 
              alt="Mythic Society Building" 
              style={{width:'100%', borderRadius: '6px'}} 
            />
            <div style={{color: '#666', fontSize: '0.9em', marginTop: '-5px'}}>
              The Mythic Society, Bengaluru
            </div>
            
            <img 
              src="https://mythicsociety.github.io/AksharaBhandara/assets/Home-image.png" 
              alt="Akshara Bhandara" 
              style={{width:'100%', borderRadius: '6px'}} 
            />
            <div style={{color: '#666', fontSize: '0.9em', marginTop: '-5px'}}>
              Akshara Bhandara Digital Platform
            </div>
            
            <img 
              src="https://mythicsociety.org/bsms_ci/assets/uploads/banner/talegari.JPG" 
              alt="Inscriptions Project" 
              style={{width:'100%', borderRadius: '6px'}} 
            />
            <div style={{color: '#666', fontSize: '0.9em', marginTop: '-5px'}}>
              Documentation of Inscriptions
            </div>
          </div>
        </>
      ) : photos.length > 0 ? (
        <>
          <h6>Photos</h6>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {photos.map((photo, index) => (
              <div key={index}>
                <img 
                  src={photo} 
                  alt={`${selectedSite.Temple || selectedSite.name || 'Heritage site'} - Photo ${index+1}`} 
                  style={{width:'100%', borderRadius: '6px'}}
                  onError={(e) => {
                    // Fallback for broken images
                    e.target.src = "https://mythicsociety.org/bsms_ci/assets/uploads/banner/placeholder.jpg";
                  }} 
                />
                <div style={{color: '#666', fontSize: '0.9em', marginTop: '5px'}}>
                  {selectedSite.Temple || selectedSite.name || 'Heritage site'} 
                  {selectedSite.Village ? `, ${selectedSite.Village}` : ''}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert-secondary">
          <p>No photos available for this heritage site.</p>
          <p>If you have photos of this site, please share them through our feedback form.</p>
        </div>
      )}
    </>
  );
}

export default PhotosTab;
