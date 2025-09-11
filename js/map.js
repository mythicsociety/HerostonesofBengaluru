// Expose district GeoJSON filenames globally for dropdown
// Expose Taluk geojson files globally for dropdown
window.talukGeojsonFiles = [
  { path: "Taluks/Bengaluru_(Rural)/Devanahalli.geojson", label: "Devanahalli (Bengaluru Rural)" },
  { path: "Taluks/Bengaluru_(Rural)/Doddaballapura.geojson", label: "Doddaballapura (Bengaluru Rural)" },
  { path: "Taluks/Bengaluru_(Rural)/Hoskote.geojson", label: "Hoskote (Bengaluru Rural)" },
  { path: "Taluks/Bengaluru_(Rural)/Nelamangala.geojson", label: "Nelamangala (Bengaluru Rural)" },
  { path: "Taluks/Bengaluru_(Urban)/Anekal.geojson", label: "Anekal (Bengaluru Urban)" },
  { path: "Taluks/Bengaluru_(Urban)/Bangalore-East.geojson", label: "Bangalore East (Bengaluru Urban)" },
  { path: "Taluks/Bengaluru_(Urban)/Bangalore-South.geojson", label: "Bangalore South (Bengaluru Urban)" },
  { path: "Taluks/Bengaluru_(Urban)/Bengaluru-North.geojson", label: "Bengaluru North (Bengaluru Urban)" },
  { path: "Taluks/Bengaluru_(Urban)/Yelahanka.geojson", label: "Yelahanka (Bengaluru Urban)" },
  { path: "Taluks/Ramanagara/Channapatna.geojson", label: "Channapatna (Ramanagara)" },
  { path: "Taluks/Ramanagara/Harohalli.geojson", label: "Harohalli (Ramanagara)" },
  { path: "Taluks/Ramanagara/Kanakpura.geojson", label: "Kanakpura (Ramanagara)" },
  { path: "Taluks/Ramanagara/Magadi.geojson", label: "Magadi (Ramanagara)" },
  { path: "Taluks/Ramanagara/Ramanagara.geojson", label: "Ramanagara (Ramanagara)" }
];

// Store loaded taluk layers
window._talukLayers = {};

// Add/remove taluk boundaries based on selection and zoom to extent
window.setTalukBoundariesVisibility = function(selectedTaluks) {
  if (!window.map) return;
  // Remove all taluk layers first
  Object.values(window._talukLayers).forEach(function(layer) {
    window.map.removeLayer(layer);
  });
  // Track bounds for all selected taluks
  var boundsList = [];
  var toLoad = [];
  selectedTaluks.forEach(function(path) {
    if (window._talukLayers[path]) {
      window.map.addLayer(window._talukLayers[path]);
      var b = window._talukLayers[path].getBounds();
      if (b.isValid()) boundsList.push(b);
    } else {
      toLoad.push(path);
    }
  });
  // If any taluks need to be loaded, fetch and add them, then zoom after all loaded
  if (toLoad.length > 0) {
    Promise.all(toLoad.map(function(path) {
      return fetch('geojson/' + path)
        .then(res => res.json())
        .then(data => {
          var layer = L.geoJSON(data, {
            style: {
              color: '#16a085',
              weight: 2,
              fillOpacity: 0.1
            }
          });
          window._talukLayers[path] = layer;
          window.map.addLayer(layer);
          var b = layer.getBounds();
          if (b.isValid()) boundsList.push(b);
        });
    })).then(function() {
      if (boundsList.length > 0) {
        var finalBounds = boundsList[0];
        boundsList.forEach(function(b) { finalBounds = finalBounds.extend(b); });
        window.map.fitBounds(finalBounds, {padding: [40,40], maxZoom: 13});
      }
    });
  } else {
    if (boundsList.length > 0) {
      var finalBounds = boundsList[0];
      boundsList.forEach(function(b) { finalBounds = finalBounds.extend(b); });
      window.map.fitBounds(finalBounds, {padding: [40,40], maxZoom: 13});
    }
  }
};
window.districtGeojsonFiles = [
  "KA_Bengaluru (Rural).geojson",
  "KA_Bengaluru (Urban).geojson",
  "KA_Chikkaballapura.geojson",
  "KA_Chikkamagaluru.geojson",
  "KA_Mandya.geojson",
  "KA_Mysuru.geojson",
  "KA_Ramanagara.geojson"
];

// Store loaded district layers
window._districtLayers = {};

// Add/remove district boundaries based on selection
window.setDistrictBoundariesVisibility = function(selectedFiles) {
  if (!window.map) return;
  // Remove all district layers first
  Object.values(window._districtLayers).forEach(function(layer) {
    window.map.removeLayer(layer);
  });
  // Track bounds for all selected districts
  var boundsList = [];
  var toLoad = [];
  selectedFiles.forEach(function(file) {
    if (window._districtLayers[file]) {
      window.map.addLayer(window._districtLayers[file]);
      var b = window._districtLayers[file].getBounds();
      if (b.isValid()) boundsList.push(b);
    } else {
      toLoad.push(file);
    }
  });
  // If any districts need to be loaded, fetch and add them, then zoom after all loaded
  if (toLoad.length > 0) {
    Promise.all(toLoad.map(function(file) {
      return fetch('geojson/Districts/' + file)
        .then(res => res.json())
        .then(data => {
          var layer = L.geoJSON(data, {
            style: {
              color: '#2c3e50',
              weight: 2,
              fillOpacity: 0.1
            }
          });
          window._districtLayers[file] = layer;
          window.map.addLayer(layer);
          var b = layer.getBounds();
          if (b.isValid()) boundsList.push(b);
        });
    })).then(function() {
      if (boundsList.length > 0) {
        var finalBounds = boundsList[0];
        boundsList.forEach(function(b) { finalBounds = finalBounds.extend(b); });
        window.map.fitBounds(finalBounds, {padding: [40,40], maxZoom: 13});
      }
    });
  } else {
    if (boundsList.length > 0) {
      var finalBounds = boundsList[0];
      boundsList.forEach(function(b) { finalBounds = finalBounds.extend(b); });
      window.map.fitBounds(finalBounds, {padding: [40,40], maxZoom: 13});
    }
  }
};

window.baseLayers = {
  "OSM Standard": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM contributors' }),
  "OSM Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap' }),
  "OSM Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri, Maxar, Earthstar Geographics' })
};

var map = L.map('map').setView([12.97,77.59],11);
window.baseLayers["OSM Standard"].addTo(map);
window.map = map;
// Initialize SidePanel after map is created
if (window.initSidePanel) {
  window.initSidePanel(window.map);
}

// Initialize layers based on State
document.addEventListener('DOMContentLoaded', function() {
  // Do not load Heritage Sites layers by default
});

// GeoJSON layers are defined below with proper marker styling


// --- Clustering Setup ---
var herostonesLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-marker herostone',
        html: '<div style="background:#0074D9;border:2px solid #fff;border-radius:50%;width:16px;height:16px;"></div>',
        iconSize: [16, 16]
      })
    });
  },
  onEachFeature: function (feature, layer) {
    let props = feature.properties;
    let html = `<b>Herostone</b><br/>`;
    for (const key in props) {
      html += `${key}: ${props[key]}<br/>`;
    }
    layer.bindPopup(html);
  }
});

var inscriptionsLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-marker inscription',
        html: '<div style="background:#FF851B;border:2px solid #fff;border-radius:50%;width:16px;height:16px;"></div>',
        iconSize: [16, 16]
      })
    });
  },
  onEachFeature: function (feature, layer) {
    let props = feature.properties;
    let html = `<b>Inscription</b><br/>`;
    for (const key in props) {
      html += `${key}: ${props[key]}<br/>`;
    }
    layer.bindPopup(html);
  }
});

var templesLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-marker temple',
        html: '<div style="background:#e63946;border:2px solid #fff;border-radius:50%;width:16px;height:16px;"></div>',
        iconSize: [16, 16]
      })
    });
  },
  onEachFeature: function (feature, layer) {
    let props = feature.properties;
    let html = `<b>Temple</b><br/>`;
    for (const key in props) {
      html += `${key}: ${props[key]}<br/>`;
    }
    layer.bindPopup(html);
  }
});

// Cluster groups

function createColoredClusterGroup(colorClass) {
  return L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      var count = cluster.getChildCount();
      return L.divIcon({
        html: '<div style="background:' + colorClass.color + ';border:2px solid #fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;"><span style="color:#fff;font-weight:bold;">' + count + '</span></div>',
        className: 'marker-cluster marker-cluster-' + colorClass.name,
        iconSize: [32, 32]
      });
    }
  });
}

var herostonesCluster = createColoredClusterGroup({name:'herostones', color:'#0074D9'});
var inscriptionsCluster = createColoredClusterGroup({name:'inscriptions', color:'#FF851B'});
var templesCluster = createColoredClusterGroup({name:'temples', color:'#e63946'});

// Track clustering state
var clusteringState = {
  Herostones: false,
  Inscriptions: false,
  Temples: false
};


// Only load and add layers when enabled by user
function loadLayerGeoJSON(layerName) {
  function displayLoadError(layerName) {
    alert(`Error loading ${layerName} data. Please check the console for details.`);
  }
  
  if (layerName === 'Herostones' && !window._herostonesLoaded) {
    fetch('geojson/Herostones.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        herostonesLayer.addData(data);
        herostonesCluster.clearLayers();
        herostonesCluster.addLayers(herostonesLayer.getLayers());
        window._herostonesLoaded = true;
      })
      .catch(error => {
        console.error('Error loading Herostones.geojson:', error);
        // Try lowercase as fallback
        fetch('geojson/herostones.geojson')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
          })
          .then(data => {
            herostonesLayer.addData(data);
            herostonesCluster.clearLayers();
            herostonesCluster.addLayers(herostonesLayer.getLayers());
            window._herostonesLoaded = true;
          })
          .catch(error => {
            console.error('Error loading herostones.geojson (fallback):', error);
            displayLoadError('Herostones');
          });
      });
  }
  if (layerName === 'Inscriptions' && !window._inscriptionsLoaded) {
    fetch('geojson/Inscriptions.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        inscriptionsLayer.addData(data);
        inscriptionsCluster.clearLayers();
        inscriptionsCluster.addLayers(inscriptionsLayer.getLayers());
        window._inscriptionsLoaded = true;
      })
      .catch(error => {
        console.error('Error loading Inscriptions.geojson:', error);
        // Try lowercase as fallback
        fetch('geojson/inscriptions.geojson')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
          })
          .then(data => {
            inscriptionsLayer.addData(data);
            inscriptionsCluster.clearLayers();
            inscriptionsCluster.addLayers(inscriptionsLayer.getLayers());
            window._inscriptionsLoaded = true;
          })
          .catch(error => {
            console.error('Error loading inscriptions.geojson (fallback):', error);
            displayLoadError('Inscriptions');
          });
      });
  }
  if (layerName === 'Temples' && !window._templesLoaded) {
    fetch('geojson/Temples.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        templesLayer.addData(data);
        templesCluster.clearLayers();
        templesCluster.addLayers(templesLayer.getLayers());
        window._templesLoaded = true;
      })
      .catch(error => {
        console.error('Error loading Temples.geojson:', error);
        // Try lowercase as fallback
        fetch('geojson/temples.geojson')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
          })
          .then(data => {
            templesLayer.addData(data);
            templesCluster.clearLayers();
            templesCluster.addLayers(templesLayer.getLayers());
            window._templesLoaded = true;
          })
          .catch(error => {
            console.error('Error loading temples.geojson (fallback):', error);
            displayLoadError('Temples');
          });
      });
  }
}

// Do not add overlay layers to map by default

function setLayerVisibility(layerName, visible) {
  // Remove both cluster and non-cluster layers
  if (layerName === "Herostones") {
    map.removeLayer(herostonesLayer);
    map.removeLayer(herostonesCluster);
    if (visible) {
      loadLayerGeoJSON('Herostones');
      if (clusteringState.Herostones) {
        map.addLayer(herostonesCluster);
      } else {
        map.addLayer(herostonesLayer);
      }
    }
  } else if (layerName === "Inscriptions") {
    map.removeLayer(inscriptionsLayer);
    map.removeLayer(inscriptionsCluster);
    if (visible) {
      loadLayerGeoJSON('Inscriptions');
      if (clusteringState.Inscriptions) {
        map.addLayer(inscriptionsCluster);
      } else {
        map.addLayer(inscriptionsLayer);
      }
    }
  } else if (layerName === "Temples") {
    map.removeLayer(templesLayer);
    map.removeLayer(templesCluster);
    if (visible) {
      loadLayerGeoJSON('Temples');
      if (clusteringState.Temples) {
        map.addLayer(templesCluster);
      } else {
        map.addLayer(templesLayer);
      }
    }
  }
}

// Clustering toggle handler
function setLayerClustering(layerName, enable) {
  clusteringState[layerName] = enable;
  setLayerVisibility(layerName, true);
}


// --- Features Panel Dropdown Logic ---
// Utility: Get visible marker layers
function getVisibleMarkerLayers() {
  const layers = [];
  if (window.map.hasLayer(herostonesLayer) || window.map.hasLayer(herostonesCluster)) layers.push({name: 'Herostones', layer: herostonesLayer});
  if (window.map.hasLayer(inscriptionsLayer) || window.map.hasLayer(inscriptionsCluster)) layers.push({name: 'Inscriptions', layer: inscriptionsLayer});
  if (window.map.hasLayer(templesLayer) || window.map.hasLayer(templesCluster)) layers.push({name: 'Temples', layer: templesLayer});
  return layers;
}

// Utility: Get marker display name
function getMarkerName(feature, layerName) {
  const props = feature.properties || {};
  return (
    props.Name || props.name || props.Title || props.title ||
    props.Site || props.site || props.Temple || props.temple ||
    props.Herostone || props.herostone || props.Inscription || props.inscription ||
    `Marker (${layerName})`
  );
}

// Render dropdown for a single layer
function renderLayerDropdown(layerObj, layerName, container) {
  const markers = layerObj.getLayers().filter(l => l instanceof L.Marker);
  if (markers.length === 0) return false;
  const selectId = `dropdown-${layerName}`;
  const options = markers.map((marker, idx) => {
    const feature = marker.feature || {};
    const markerName = getMarkerName(feature, layerName);
    return `<option value="${idx}">${markerName}</option>`;
  }).join('');
  container.innerHTML += `
    <div class="mb-3">
      <label for="${selectId}"><strong>${layerName}</strong></label>
      <select class="form-select mb-2" id="${selectId}">
        <option value="" disabled selected>Select a marker...</option>
        ${options}
      </select>
    </div>
  `;
  setTimeout(() => {
    const select = document.getElementById(selectId);
    if (select) {
      select.onchange = function() {
        handleMarkerSelect(markers, this.value);
      };
    }
  }, 0);
  return true;
}

function handleMarkerSelect(markers, value) {
    const idx = parseInt(value);
    const marker = markers[idx];
    if (marker) {
        window.map.setView(marker.getLatLng(), 16, {animate: true});
        const markerEl = marker._icon;
        if (markerEl) {
            markerEl.classList.add('marker-blink');
            setTimeout(() => markerEl.classList.remove('marker-blink'), 5000);
        }
        // No popup
    }
}

// Main render function for Features dropdowns
function renderFeaturesDropdowns() {
  // Find the Features tab content in the custom right panel
  // Always use tab-2 for Features tab
  let container = document.querySelector('#panelRight .sidepanel-tab-content[data-tab-content="tab-2"]');
  if (!container) container = document.getElementById('features-dropdowns');
  if (!container) return;
  // Clear previous content
  container.innerHTML = '<h4>Features</h4><div id="features-dropdowns"></div>';
  const dropdownsDiv = container.querySelector('#features-dropdowns');
  const visibleLayers = getVisibleMarkerLayers();
  let anyMarkers = false;
  visibleLayers.forEach(({name, layer}) => {
    if (renderLayerDropdown(layer, name, dropdownsDiv)) {
      anyMarkers = true;
    }
  });
  if (!anyMarkers) {
    dropdownsDiv.innerHTML = '<div class="text-danger mt-3">No Heritage Sites Visible on Map.<br><small>Load them from Layers Panel.</small></div>';
  } else {
    // Add donut chart below dropdowns
    dropdownsDiv.innerHTML += '<div class="mt-4"><canvas id="featuresDonutChart" width="220" height="220"></canvas></div>';
    setTimeout(() => {
      const ctx = document.getElementById('featuresDonutChart').getContext('2d');
      const visibleLayers = getVisibleMarkerLayers();
      const labels = visibleLayers.map(l => l.name);
      const data = visibleLayers.map(l => l.layer.getLayers().filter(m => m instanceof L.Marker).length);
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#0074D9', '#FF851B', '#e63946'],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Visible Heritage Sites' }
          },
          cutout: '60%'
        }
      });
    }, 0);
  }
}

// Re-render dropdowns when layers change
window.renderFeaturesDropdowns = renderFeaturesDropdowns;

// Hook into tab open event for Features tab

// For custom right panel (panelRight), hook into tab switching
document.addEventListener('DOMContentLoaded', function() {
  const tabLinks = document.querySelectorAll('#panelRight .sidebar-tab-link');
  tabLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const tabId = link.getAttribute('data-tab-link');
      if (tabId === 'tab-2') {
        setTimeout(renderFeaturesDropdowns, 0);
      }
    });
  });
  // Also render on initial load if Features tab is visible
  const featuresTabContent = document.querySelector('#panelRight .sidepanel-tab-content[data-tab-content="tab-2"]');
  if (featuresTabContent && featuresTabContent.style.display !== 'none') {
    setTimeout(renderFeaturesDropdowns, 0);
  }
});

// Also re-render when layers are toggled
['Herostones', 'Inscriptions', 'Temples'].forEach(layerName => {
  const origSetLayerVisibility = window.setLayerVisibility;
  window.setLayerVisibility = function(name, visible) {
    origSetLayerVisibility.apply(this, arguments);
    // Always update Features tab immediately
    renderFeaturesDropdowns();
  };
});
