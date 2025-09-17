// Sets the basemap layer based on the selected value
function setBasemap(basemap) {
  if (!window.map || !window.baseLayers) {
    console.warn('Map or baseLayers not found');
    return;
  }
  console.log('Switching basemap to:', basemap);
  // Remove all basemap layers
  Object.entries(window.baseLayers).forEach(function([key, layer]) {
    if (window.map.hasLayer(layer)) {
      window.map.removeLayer(layer);
      console.log('Removed basemap:', key);
    }
  /**
   * layers.js
   * Layer tab logic and map initialization for WebGIS
   * All logic preserved, only code style and comments improved.
   */
  });
  // Add selected basemap
  if (window.baseLayers[basemap]) {
    window.map.addLayer(window.baseLayers[basemap]);
    console.log('Added basemap:', basemap);
  } else {
    console.warn('Basemap not found:', basemap);
  }
}

// Renders the Layers tab content in the left sidebar
function renderLayersTab(container) {

  container.innerHTML = `
    <div class="mb-4">
      <strong style="user-select:none;">Heritage Sites</strong>
      <div class="d-flex flex-column gap-2">
        <div class="d-flex align-items-center justify-content-between">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="layerHerostones">
            <label class="form-check-label" for="layerHerostones">Herostones</label>
          </div>
          <div class="form-switch ms-2">
            <input class="form-check-input" type="checkbox" id="clusterHerostones">
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="layerInscriptions">
            <label class="form-check-label" for="layerInscriptions">Inscriptions</label>
          </div>
          <div class="form-switch ms-2">
            <input class="form-check-input" type="checkbox" id="clusterInscriptions">
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="layerTemples">
            <label class="form-check-label" for="layerTemples">Temples</label>
          </div>
          <div class="form-switch ms-2">
            <input class="form-check-input" type="checkbox" id="clusterTemples">
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <strong style="user-select:none;">Basemaps</strong>
      <select class="form-select" id="basemapDropdown">
        <option value="OSM Standard" selected>OSM Standard</option>
        <option value="OSM Terrain">OSM Terrain</option>
        <option value="OSM Satellite">OSM Satellite</option>
      </select>
      <div class="mt-3">
        <label for="basemapOpacity" class="form-label">Basemap Opacity</label>
        <input type="range" class="form-range" id="basemapOpacity" min="0.2" max="1" step="0.01" value="1">
      </div>
    </div>
    <div class="mb-4">
      <strong style="user-select:none;">Administration Boundaries</strong>
      <div class="mt-2">
        <label for="districtsDropdown" class="form-label">Districts</label>
        <select class="form-select" id="districtsDropdown">
          <option value="" selected disabled>Select a district</option>
          <!-- District options will be populated dynamically -->
        </select>
      </div>
      <div class="mt-2">
        <label for="taluksDropdown" class="form-label">Taluks</label>
        <select class="form-select" id="taluksDropdown">
          <option value="" selected disabled>Select a taluk</option>
          <!-- Taluk options will be populated dynamically -->
        </select>
      </div>
  `;

  // Populate Taluks dropdown dynamically
  if (window.talukGeojsonFiles && Array.isArray(window.talukGeojsonFiles)) {
    var talukDropdown = document.getElementById('taluksDropdown');
    window.talukGeojsonFiles.forEach(function(item) {
      var option = document.createElement('option');
      option.value = item.path;
      option.textContent = item.label;
      talukDropdown.appendChild(option);
    });
  }

  // Add event listener for taluk selection
  document.getElementById('taluksDropdown').addEventListener('change', function(e) {
    if (typeof setTalukBoundariesVisibility === 'function') {
      var selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setTalukBoundariesVisibility(selected);
    }
  });

  // Populate Districts dropdown dynamically
  if (window.districtGeojsonFiles && Array.isArray(window.districtGeojsonFiles)) {
    var dropdown = document.getElementById('districtsDropdown');
    window.districtGeojsonFiles.forEach(function(file) {
      var option = document.createElement('option');
      option.value = file;
      option.textContent = file.replace('.geojson', '').replace(/_/g, ' ');
      dropdown.appendChild(option);
    });
  }

  // Add event listener for district selection
  document.getElementById('districtsDropdown').addEventListener('change', function(e) {
    if (typeof setDistrictBoundariesVisibility === 'function') {
      var selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setDistrictBoundariesVisibility(selected);
    }
  });

  // Add event listeners for layer visibility checkboxes

  function updateClusteringSwitch(layerName, layerCheckboxId, clusterCheckboxId, layerObj) {
    var layerCheckbox = document.getElementById(layerCheckboxId);
    var clusterCheckbox = document.getElementById(clusterCheckboxId);
    if (!layerCheckbox || !clusterCheckbox) return;
    // Disable clustering switch if layer is not checked or no points visible
    var visible = layerCheckbox.checked;
    var hasPoints = layerObj && layerObj.getLayers && layerObj.getLayers().length > 0;
    clusterCheckbox.disabled = !(visible && hasPoints);
    // Only uncheck clustering switch if disabling, but never touch layerCheckbox
    if (clusterCheckbox.disabled && clusterCheckbox.checked) clusterCheckbox.checked = false;
  }

  document.getElementById('layerHerostones').addEventListener('change', function(e) {
    if (typeof setLayerVisibility === 'function') setLayerVisibility('Herostones', e.target.checked);
    setTimeout(function() {
      updateClusteringSwitch('Herostones', 'layerHerostones', 'clusterHerostones', window.herostonesLayer);
    }, 300);
  });
  document.getElementById('layerInscriptions').addEventListener('change', function(e) {
    if (typeof setLayerVisibility === 'function') setLayerVisibility('Inscriptions', e.target.checked);
    setTimeout(function() {
      updateClusteringSwitch('Inscriptions', 'layerInscriptions', 'clusterInscriptions', window.inscriptionsLayer);
    }, 300);
  });
  document.getElementById('layerTemples').addEventListener('change', function(e) {
    if (typeof setLayerVisibility === 'function') setLayerVisibility('Temples', e.target.checked);
    setTimeout(function() {
      updateClusteringSwitch('Temples', 'layerTemples', 'clusterTemples', window.templesLayer);
    }, 300);
  });

  document.getElementById('clusterHerostones').addEventListener('change', function(e) {
    if (!e.target.disabled && typeof setLayerClustering === 'function') setLayerClustering('Herostones', e.target.checked);
  });
  document.getElementById('clusterInscriptions').addEventListener('change', function(e) {
    if (!e.target.disabled && typeof setLayerClustering === 'function') setLayerClustering('Inscriptions', e.target.checked);
  });
  document.getElementById('clusterTemples').addEventListener('change', function(e) {
    if (!e.target.disabled && typeof setLayerClustering === 'function') setLayerClustering('Temples', e.target.checked);
  });

  // Initial state for clustering switches
  setTimeout(function() {
    updateClusteringSwitch('Herostones', 'layerHerostones', 'clusterHerostones', window.herostonesLayer);
    updateClusteringSwitch('Inscriptions', 'layerInscriptions', 'clusterInscriptions', window.inscriptionsLayer);
    updateClusteringSwitch('Temples', 'layerTemples', 'clusterTemples', window.templesLayer);
  }, 500);

  // Add event listener for basemap dropdown
  document.getElementById('basemapDropdown').addEventListener('change', function(e) {
    if (typeof setBasemap === 'function') setBasemap(e.target.value);
  });

  // Add event listener for basemap opacity slider
  document.getElementById('basemapOpacity').addEventListener('input', function(e) {
    var opacity = parseFloat(e.target.value);
    if (window.baseLayers && document.getElementById('basemapDropdown')) {
      var selected = document.getElementById('basemapDropdown').value;
      if (window.baseLayers[selected]) {
        window.baseLayers[selected].setOpacity(opacity);
      }
    }
  });

  // ...existing code...
}
