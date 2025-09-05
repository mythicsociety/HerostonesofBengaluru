import React, { useEffect, useState } from 'react';

function WikipediaTab({ showDefault, selectedSite }) {
  const [wikiContent, setWikiContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Function to fetch Wikipedia content when a site is selected
    const fetchWikiContent = async (searchTerm) => {
      if (!searchTerm) return;
      
      setLoading(true);
      try {
        // Example API call to Wikipedia
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWikiContent({
            title: data.title,
            extract: data.extract,
            thumbnail: data.thumbnail?.source,
            url: data.content_urls?.desktop?.page
          });
        } else {
          setWikiContent(null);
        }
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        setWikiContent(null);
      } finally {
        setLoading(false);
      }
    };
    
    // If a site is selected, search for relevant Wikipedia content
    if (selectedSite) {
      let searchTerm = '';
      
      if (selectedSite.Temple) {
        searchTerm = selectedSite.Temple;
      } else if (selectedSite.Site) {
        searchTerm = selectedSite.Site;
      } else if (selectedSite.name) {
        searchTerm = selectedSite.name;
      }
      
      // Add location context for better search results
      if (selectedSite.Village || selectedSite.Taluk || selectedSite.District) {
        searchTerm += ' ' + (selectedSite.Village || selectedSite.Taluk || selectedSite.District);
      }
      
      if (searchTerm) {
        fetchWikiContent(searchTerm);
      }
    }
  }, [selectedSite]);

  return (
    <>
      {showDefault ? (
        <>
          <div style={{marginBottom: '20px'}}>
            <h6>Wikipedia Resources</h6>
            <p><a href="https://en.wikipedia.org/wiki/Daly_Memorial_Hall#Mythic_society" target="_blank" rel="noopener noreferrer">The Mythic Society</a></p>
            <p><a href="https://www.wikidata.org/wiki/Q5211784" target="_blank" rel="noopener noreferrer">Wikidata: Q5211784</a></p>
            
            <h6 style={{marginTop: '20px'}}>Related Wikipedia Articles</h6>
            <ul>
              <li><a href="https://en.wikipedia.org/wiki/Inscriptions_in_Karnataka" target="_blank" rel="noopener noreferrer">Inscriptions in Karnataka</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Hero_stone" target="_blank" rel="noopener noreferrer">Hero stones (Veeragallu)</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Bengaluru" target="_blank" rel="noopener noreferrer">Bengaluru</a></li>
            </ul>
          </div>
          
          <div className="alert alert-info">
            Select a heritage site on the map to view its Wikipedia information.
          </div>
        </>
      ) : loading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{marginTop: '10px'}}>Searching Wikipedia...</p>
        </div>
      ) : wikiContent ? (
        <div>
          <h6>{wikiContent.title}</h6>
          
          {wikiContent.thumbnail && (
            <img 
              src={wikiContent.thumbnail} 
              alt={wikiContent.title}
              style={{
                float: 'right',
                maxWidth: '120px',
                marginLeft: '10px',
                marginBottom: '10px',
                borderRadius: '4px'
              }}
            />
          )}
          
          <p>{wikiContent.extract}</p>
          
          {wikiContent.url && (
            <p>
              <a 
                href={wikiContent.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                Read more on Wikipedia <i className="fa fa-external-link-alt"></i>
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="alert alert-secondary">
          <p>No Wikipedia information found for this heritage site.</p>
          <p>Try searching on Wikipedia directly:</p>
          <a 
            href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(selectedSite?.Temple || selectedSite?.Site || 'Karnataka heritage')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-secondary"
          >
            Search Wikipedia <i className="fa fa-search"></i>
          </a>
        </div>
      )}
    </>
  );
}

export default WikipediaTab;
