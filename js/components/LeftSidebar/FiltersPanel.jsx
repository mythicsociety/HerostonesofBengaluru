function FiltersPanel({ selectedDistricts = [], setSelectedDistricts, selectedTaluks = [], setSelectedTaluks }) {
  const [districtOpen, setDistrictOpen] = React.useState(false);
  const [talukOpen, setTalukOpen] = React.useState(false);

  // Extract unique districts and taluks from all datasets
  const allData = [ ...(window.herostones || []), ...(window.inscriptions || []), ...(window.temples || []) ].filter(d => d && typeof d === 'object');
  const districtOptions = Array.from(new Set(allData.map(d => d.District_KGIS).filter(Boolean)));
  const talukOptions = Array.from(new Set(allData.filter(d => selectedDistricts.length === 0 || selectedDistricts.includes(d.District_KGIS)).map(d => d.Taluk_KGIS).filter(Boolean)));

  // Handlers for selection
  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistricts(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    setSelectedTaluks([]); // Reset taluks when districts change
  };
  const handleTalukChange = (e) => {
    const value = e.target.value;
    setSelectedTaluks(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

    // Filtering logic function
    function applyFilters(districts, taluks) {
      districts = Array.isArray(districts) ? districts : [];
      taluks = Array.isArray(taluks) ? taluks : [];
      // Filter allData based on selected districts and taluks
      let filtered = allData;
      if (districts.length > 0) {
        filtered = filtered.filter(d => districts.includes(d.District_KGIS));
      }
      if (taluks.length > 0) {
        filtered = filtered.filter(d => taluks.includes(d.Taluk_KGIS));
      }
      // Optionally, update global filtered data or trigger map update
      window.filteredHeritageData = filtered;
      if (window.forceMapUpdate) window.forceMapUpdate();
    }

    // Initial filter on mount
    React.useEffect(() => {
      applyFilters(selectedDistricts, selectedTaluks);
    }, [selectedDistricts, selectedTaluks]);

  return (
    <div style={{padding: '0.5em 0.5em 0.5em 0'}}>
      {/* Common Filters Section */}
      <div style={{marginBottom: '1.2em'}}>
        <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d', cursor: 'pointer'}} onClick={() => setDistrictOpen(o => !o)}>
          {districtOpen ? '▼' : '►'} District (Common Filter)
        </div>
        {districtOpen && (
          <>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px'}}>
              {selectedDistricts.map(d => (
                <span key={d} style={{background: '#e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '0.95em'}}>{d} <button style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => setSelectedDistricts(selectedDistricts.filter(v => v !== d))}>×</button></span>
              ))}
            </div>
            <div>
              {districtOptions.map(d => (
                <label key={d} style={{display: 'block', marginBottom: '2px'}}>
                  <input type="checkbox" value={d} checked={selectedDistricts.includes(d)} onChange={handleDistrictChange} /> {d}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{marginBottom: '1.2em'}}>
        <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d', cursor: 'pointer'}} onClick={() => setTalukOpen(o => !o)}>
          {talukOpen ? '▼' : '►'} Taluk (Common Filter)
        </div>
        {talukOpen && (
          <>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px'}}>
              {selectedTaluks.map(t => (
                <span key={t} style={{background: '#e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '0.95em'}}>{t} <button style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => setSelectedTaluks(selectedTaluks.filter(v => v !== t))}>×</button></span>
              ))}
            </div>
            <div>
              {talukOptions.map(t => (
                <label key={t} style={{display: 'block', marginBottom: '2px'}}>
                  <input type="checkbox" value={t} checked={selectedTaluks.includes(t)} onChange={handleTalukChange} /> {t}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ...existing code for other filters... */}
      <div style={{marginBottom: '1.2em'}}>
        <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d'}}>Period/Century</div>
        <select className="form-control" id="period-filter">
          <option value="">All Periods</option>
          <option value="10th Century">10th Century</option>
          <option value="11th Century">11th Century</option>
          <option value="12th Century">12th Century</option>
          <option value="13th Century">13th Century</option>
        </select>
      </div>
      <div style={{marginBottom: '1.2em'}}>
        <div style={{fontWeight: 600, marginBottom: '0.5em', color: '#72383d'}}>Keywords</div>
        <input type="text" className="form-control" id="keyword-filter" placeholder="Search by keywords" />
      </div>
      <div style={{marginBottom: '1.2em'}}>
        <button className="btn btn-primary" style={{marginRight: '10px', background: '#72383d', border: 'none'}}>Apply Filters</button>
        <button className="btn btn-secondary">Reset</button>
      </div>
    </div>
  )
}

window.FiltersPanel = FiltersPanel;
