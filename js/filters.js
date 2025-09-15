
// Renders the Filters tab content in the left sidebar
function renderFiltersTab(container) {
  console.log('[Filters] renderFiltersTab called, container:', container);
  // Always reset the container
  container.innerHTML = `
    <div class="mb-4">
      <strong style="user-select:none;">Common Filter</strong>
      <div class="mb-2">
          <div id="districtChips" class="mb-2 d-flex flex-wrap gap-1"></div>
          <div class="dropdown" style="width:100%;">
            <button class="btn btn-light w-100 d-flex justify-content-between align-items-center" type="button" id="districtMultiSelect" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="district-btn-label">Select Districts</span>
              <span class="dropdown-icon" style="transition:transform 0.2s;"><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </button>
            <ul class="dropdown-menu w-100" aria-labelledby="districtMultiSelect" id="districtMultiSelectList" style="max-height:220px;overflow-y:auto;">
              <!-- District options will be injected here -->
            </ul>
          </div>
      </div>
    </div>
  `;
  // Populate district options from geojson files
  const geojsonFiles = [
    'geojson/Herostones.geojson',
    'geojson/Inscriptions.geojson',
    'geojson/Temples.geojson'
  ];
  let districtsSet = new Set();
  let loaded = 0;
  geojsonFiles.forEach(file => {
    fetch(file)
      .then(r => r.json())
      .then(data => {
        if(Array.isArray(data.features)) {
          data.features.forEach(f => {
            let d = f.properties.District_KGIS || f.properties.District || f.properties.district;
            if(d && typeof d === 'string') districtsSet.add(d.trim());
          });
        }
        loaded++;
        if(loaded === geojsonFiles.length) {
          renderDistrictOptions(Array.from(districtsSet).sort());
        }
      });
  });

  function renderDistrictOptions(districts) {
    const list = document.getElementById('districtMultiSelectList');
    if(!list) return;
    list.innerHTML = districts.map(d => `
      <li>
        <label class="dropdown-item">
          <input type="checkbox" class="form-check-input me-2 district-filter" value="${d}"> ${d}
        </label>
      </li>
    `).join('');
    // Handle selection
    function updateChips(selected) {
      const chips = document.getElementById('districtChips');
      if (!chips) return;
      chips.innerHTML = selected.map(d => `
        <span class="district-chip badge bg-primary text-light d-flex align-items-center" style="padding-right:6px;">
          <span style="padding-right:4px;">${d}</span>
          <button type="button" class="btn btn-sm btn-close ms-1 p-0" aria-label="Remove" data-district="${d}" style="filter:invert(1);width:18px;height:18px;"></button>
        </span>
      `).join('');
      chips.querySelectorAll('button[data-district]').forEach(btn => {
        btn.addEventListener('click', function() {
          const toRemove = btn.getAttribute('data-district');
          // Uncheck in dropdown
          const cb = list.querySelector(`input.district-filter[value="${toRemove}"]`);
          if(cb) cb.checked = false;
          // Update selection
          let selected = Array.from(list.querySelectorAll('input.district-filter:checked')).map(x => x.value);
          State.filters.districts = selected;
          if(typeof applyFilters === 'function') applyFilters();
          updateChips(selected);
          // Update button text
          const btnLabel = document.getElementById('districtMultiSelect').querySelector('.district-btn-label');
          if(btnLabel) btnLabel.textContent = selected.length ? selected.join(', ') : 'Select Districts';
        });
      });
    }
    list.querySelectorAll('input.district-filter').forEach(cb => {
      cb.addEventListener('change', function() {
        let selected = Array.from(list.querySelectorAll('input.district-filter:checked')).map(x => x.value);
        State.filters.districts = selected;
        if(typeof applyFilters === 'function') applyFilters();
        if(typeof window.renderFeaturesDropdowns === 'function') window.renderFeaturesDropdowns();
        // Update button text
        const btnLabel = document.getElementById('districtMultiSelect').querySelector('.district-btn-label');
        if(btnLabel) btnLabel.textContent = selected.length ? selected.join(', ') : 'Select Districts';
        updateChips(selected);
      });
    });
    // Initial chips render
    updateChips(State.filters.districts || []);
  }

  // Interactive dropdown icon rotation
  const dropdownBtn = document.getElementById('districtMultiSelect');
  if(dropdownBtn) {
    dropdownBtn.addEventListener('show.bs.dropdown', function(){
      const icon = dropdownBtn.querySelector('.dropdown-icon');
      if(icon) icon.style.transform = 'rotate(180deg)';
    });
    dropdownBtn.addEventListener('hide.bs.dropdown', function(){
      const icon = dropdownBtn.querySelector('.dropdown-icon');
      if(icon) icon.style.transform = 'rotate(0deg)';
    });
  }
}

function applyFilters() {
  // Filter map layers by selected districts
  if (!window.map) return;
  const selectedDistricts = State.filters.districts || [];
  const periodRange = window._selectedPeriodRange || [0, 100];
  // Helper to check if feature matches selected districts
  function matchesDistrict(feature) {
    if (!selectedDistricts.length) return true; // If none selected, show all
    const d = feature.properties.District_KGIS || feature.properties.District || feature.properties.district;
    return d && selectedDistricts.includes(d.trim());
  }
  // Use Leaflet's filter by setting style/display for each marker
  function filterLayerByDistrict(layerObj, layerName) {
    if (!layerObj) return [];
    // Only filter if layer is visible
    var layerCheckbox = document.getElementById('layer' + layerName);
    var visible = layerCheckbox && layerCheckbox.checked;
    var filteredMarkers = [];
    layerObj.eachLayer(function(marker) {
      var feature = marker.feature;
      if (!feature) return;
      var d = feature.properties.District_KGIS || feature.properties.District || feature.properties.district;
  // Period filter
  var period = marker.feature && marker.feature.properties && marker.feature.properties['Period (Century)'];
  var matchPeriod = period !== undefined && period !== null && !isNaN(Number(period)) && Number(period) >= periodRange[0] && Number(period) <= periodRange[1];
  var show = visible && (!selectedDistricts.length || (d && selectedDistricts.includes(d.trim()))) && matchPeriod;
      if (marker.setStyle) {
        marker.setStyle({opacity: show ? 1 : 0, fillOpacity: show ? 0.8 : 0});
      }
      if (marker._icon) {
        marker._icon.style.display = show ? '' : 'none';
      }
      if (show) filteredMarkers.push(marker);
    });
    return filteredMarkers;
  }
  var herostonesFiltered = filterLayerByDistrict(window.herostonesLayer, 'Herostones');
  var inscriptionsFiltered = filterLayerByDistrict(window.inscriptionsLayer, 'Inscriptions');
  var templesFiltered = filterLayerByDistrict(window.templesLayer, 'Temples');
  // Also update clusters if enabled
  if (window.herostonesCluster && window.herostonesLayer) {
    window.herostonesCluster.clearLayers();
    window.herostonesCluster.addLayers(herostonesFiltered);
  }
  if (window.inscriptionsCluster && window.inscriptionsLayer) {
    window.inscriptionsCluster.clearLayers();
    window.inscriptionsCluster.addLayers(inscriptionsFiltered);
  }
  if (window.templesCluster && window.templesLayer) {
    window.templesCluster.clearLayers();
    window.templesCluster.addLayers(templesFiltered);
  }

  // Re-render Features dropdowns to reflect filtered markers
  if (typeof window.renderFeaturesDropdowns === 'function') {
    window.renderFeaturesDropdowns();
  }
}
