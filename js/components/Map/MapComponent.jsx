// MapComponent for WebGIS application
// No import/export statements for browser-based usage

// Tooltip formatter for markers
function getTooltipContent(item) {
  if (item.Temple) {
    let tooltip = `<b>${item.Temple}</b>`;
    if (item.Century) tooltip += `<br/>Century: ${item.Century}`;
    if (item.Village) tooltip += `<br/>Village: ${item.Village}`;
    return tooltip;
  } else if (item.Inscription) {
    let tooltip = `<b>${item.Inscription || 'Inscription'}</b>`;
    if (item.Period) tooltip += `<br/>Period: ${item.Period}`;
    if (item.Village) tooltip += `<br/>Village: ${item.Village}`;
    return tooltip;
  } else {
    let tooltip = `<b>${item.name || 'Herostone'}</b>`;
    if (item.Period) tooltip += `<br/>Period: ${item.Period}`;
    if (item.Village) tooltip += `<br/>Village: ${item.Village}`;
    return tooltip;
  }
}

function MapComponent({
  herostones, 
  temples, 
  inscriptions, 
  showHerostones, 
  showTemples, 
  showInscriptions, 
  opacity, 
  basemap, 
  clusteringHerostones, 
  clusteringInscriptions, 
  clusteringTemples, 
  herostoneColor, 
  herostoneSize, 
  herostoneOpacity, 
  inscriptionColor, 
  inscriptionSize, 
  inscriptionOpacity, 
  templeColor, 
  templeSize, 
  templeOpacity, 
  setSelectedSite, 
  setSidebarOpen,
  selectedDistricts = [],
  selectedTaluks = []
}) {
  console.log('MapComponent rendered');
    console.log('MapComponent rendered');
  // Store references to district/taluk layers
  const districtShapeLayersRef = React.useRef({});
  const talukShapeLayersRef = React.useRef({});
  // Effect: Load and display selected district/taluk shapes
  React.useEffect(() => {
  console.log('Effect triggered. selectedDistricts:', selectedDistricts, 'selectedTaluks:', selectedTaluks);
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove previous district layers
    Object.values(districtShapeLayersRef.current).forEach(layer => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    districtShapeLayersRef.current = {};

    // Add selected district layers
    selectedDistricts.forEach(district => {
      const fileName = `data/Districts/${district}.geojson`;
      console.log('Fetching district file:', fileName);
      fetch(fileName)
        .then(res => res.json())
        .then(geojson => {
          const layer = L.geoJSON(geojson, { style: { color: '#2196f3', weight: 2, fillOpacity: 0.1 } });
          layer.addTo(map);
          districtShapeLayersRef.current[district] = layer;
        })
        .catch((err) => { console.warn('District fetch error:', fileName, err); });
    });

    // Remove previous taluk layers
    Object.values(talukShapeLayersRef.current).forEach(layer => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    talukShapeLayersRef.current = {};

    // Add selected taluk layers
    selectedTaluks.forEach(sel => {
      const fileName = `data/Taluks/${sel.district}/${sel.taluk}`;
      console.log('Fetching taluk file:', fileName);
      fetch(fileName)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(geojson => {
          const layer = L.geoJSON(geojson, { style: { color: '#56ab2f', weight: 2, fillOpacity: 0.1 } });
          layer.addTo(map);
          talukShapeLayersRef.current[sel.taluk + sel.district] = layer;
        })
        .catch((err) => { console.warn('Taluk fetch error:', fileName, err); });
    });
  }, [selectedDistricts, selectedTaluks]);
  const mapRef = React.useRef(null);
  const leafletMapRef = React.useRef(null);
  const markersRef = React.useRef({
    herostoneMarkers: [],
    inscriptionMarkers: [],
    templeMarkers: [],
    herostoneCluster: null,
    inscriptionCluster: null,
    templeCluster: null,
    basemapLayer: null
  });
  
  // COLOR_OPTIONS from the original app
  const COLOR_OPTIONS = [
    { name: 'Violet', gradient: 'linear-gradient(135deg,#a259c4 0%,#7b2ff2 100%)', solid: '#a259c4' },
    { name: 'Blue', gradient: 'linear-gradient(135deg,#2196f3 0%,#21cbf3 100%)', solid: '#2196f3' },
    { name: 'Green', gradient: 'linear-gradient(135deg,#56ab2f 0%,#a8e063 100%)', solid: '#56ab2f' },
    { name: 'Red', gradient: 'linear-gradient(135deg,#f85032 0%,#e73827 100%)', solid: '#f85032' },
    { name: 'Yellow', gradient: 'linear-gradient(135deg,#ffd200 0%,#f7971e 100%)', solid: '#ffd200' }
  ];

  // Initialize map on component mount
  React.useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapRef.current, {
  center: [12.7, 77.5], // Bengaluru default center
  zoom: 8, // Default zoom
      maxZoom: 11,
      minZoom: 1,
      zoomControl: false
    });
    
    // Add zoom control to the top right
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Set up the initial basemap
    const setupBasemap = (type = 'default') => {
      if (markersRef.current.basemapLayer) {
        map.removeLayer(markersRef.current.basemapLayer);
      }
      let layer;
      switch (type) {
        case 'satellite':
          layer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OSM Team hosted by OpenStreetMap France'
          });
          break;
        case 'terrain':
          layer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
          });
          break;
        case 'cawm':
          layer = L.tileLayer('https://cawm.lib.uiowa.edu/tiles/{z}/{x}/{y}.png', {
            attribution: 'Consortium of Ancient World Mappers &copy; University of Iowa',
            minZoom: 1,
            maxZoom: 11
          });
          break;
        case 'default':
        case 'osm':
        default:
          layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          });
          break;
      }
      layer.setOpacity(opacity);
      layer.addTo(map);
      markersRef.current.basemapLayer = layer;
    };
    
    setupBasemap(basemap);
    
    // Create sidebar using the newer syntax
    const sidebar = L.control.sidebar({
      container: 'leaflet-sidebar',
      position: 'left',
      closeButton: true,
      autopan: true
    }).addTo(map);
    
    // Marker click handler
    const onMarkerClick = (feature) => {
      setSelectedSite(feature);
      setSidebarOpen(true);
    };

    // Store map reference for later
  leafletMapRef.current = map;
  window.mapRef = leafletMapRef;

    // Cleanup on component unmount
    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update markers when data or visibility changes
  React.useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    
    // Clear existing markers
    const clearMarkers = () => {
      // Clear herostone markers
      if (markersRef.current.herostoneCluster) {
        map.removeLayer(markersRef.current.herostoneCluster);
        markersRef.current.herostoneCluster = null;
      }
      markersRef.current.herostoneMarkers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
      });
      markersRef.current.herostoneMarkers = [];

      // Clear inscription markers
      if (markersRef.current.inscriptionCluster) {
        map.removeLayer(markersRef.current.inscriptionCluster);
        markersRef.current.inscriptionCluster = null;
      }
      markersRef.current.inscriptionMarkers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
      });
      markersRef.current.inscriptionMarkers = [];

      // Clear temple markers
      if (markersRef.current.templeCluster) {
        map.removeLayer(markersRef.current.templeCluster);
        markersRef.current.templeCluster = null;
      }
      markersRef.current.templeMarkers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
      });
      markersRef.current.templeMarkers = [];
    };
    
    clearMarkers();
    
    // Helper function to create marker
    const createMarker = (item, type) => {
      let lat, lng, marker;
      // Extract coordinates based on feature type
      if (type === 'temple') {
        lat = item.Latitude ?? item.latitude ?? item.Lat ?? item.lat;
        lng = item.Longitude ?? item.longitude ?? item.Lon ?? item.lon ?? item.Long ?? item.lng;
      } else {
        lat = item.Lat ?? item.lat ?? item.latitude ?? item.Latitude;
        lng = item.Long ?? item.Lng ?? item.lng ?? item.lon ?? item.Lon ?? item.longitude ?? item.Longitude;
      }
      // Convert to numbers if needed
      if (typeof lat === 'string') lat = parseFloat(lat);
      if (typeof lng === 'string') lng = parseFloat(lng);
      // Skip if coordinates are invalid
      if (isNaN(lat) || isNaN(lng)) return null;
      // Check for safe coordinates (prevents map crashes from bad data)
      try {
        if (typeof window.isSafeCoordinates === 'function') {
          if (!window.isSafeCoordinates(lat, lng)) {
            console.warn('Skipping unsafe coordinates:', lat, lng);
            return null;
          }
        }
      } catch (e) {
        console.error('Error checking coordinates:', e);
      }
      // Configure marker style based on feature type
      let size, color, shape;
      if (type === 'herostone') {
  size = herostoneSize || 12;
        color = COLOR_OPTIONS[herostoneColor]?.solid || '#a259c4';
        shape = 'circle';
      } else if (type === 'inscription') {
  size = inscriptionSize || 12;
        color = COLOR_OPTIONS[inscriptionColor]?.solid || '#f85032';
        shape = 'square';
      } else if (type === 'temple') {
  size = templeSize || 14;
        color = COLOR_OPTIONS[templeColor]?.solid || '#ffd200';
        shape = 'triangle';
      }
      // Create marker icon with distinct shapes
      let html = '';
      if (type === 'herostone') {
        // Circle
        html = `<div style="width:${size}px;height:${size}px;background:${color};opacity:0.85;border-radius:50%;"></div>`;
      } else if (type === 'inscription') {
  // Square
  html = `<div style="width:${size}px;height:${size}px;background:${color};opacity:0.85;border-radius:0;"></div>`;
      } else if (type === 'temple') {
        // Triangle
        html = `<div style="width:0;height:0;border-left:${size/2}px solid transparent;border-right:${size/2}px solid transparent;border-bottom:${size}px solid ${color};opacity:0.85;"></div>`;
      }
      const icon = L.divIcon({
        className: `custom-marker ${type}-marker`,
        iconSize: [size, size],
        html
      });
      marker = L.marker([lat, lng], { icon, opacity: 0.85 });
      marker.bindTooltip(getTooltipContent(item), { direction: 'top', offset: [0, -size / 2], className: 'custom-tooltip' });
      marker.on('click', () => {
        setSelectedSite(item);
        setSidebarOpen(true);
      });
      return marker;
    };

    // Create and add markers in the order: inscriptions (bottom), herostones (middle), temples (top)
    // Use filteredHeritageData if available
    const filteredData = window.filteredHeritageData || [];
    // Split filteredData by type
    const filteredHerostones = filteredData.filter(d => d.Type === 'Herostone' || d.type === 'herostone');
    const filteredInscriptions = filteredData.filter(d => d.Type === 'Inscription' || d.type === 'inscription');
    const filteredTemples = filteredData.filter(d => d.Type === 'Temple' || d.type === 'temple');

    // 1. Inscriptions
    if (showInscriptions) {
      let markers = [];
      const dataToUse = filteredData.length > 0 ? filteredInscriptions : inscriptions;
      dataToUse.forEach(item => {
        const marker = createMarker(item, 'inscription');
        if (marker) markers.push(marker);
      });
      markersRef.current.inscriptionMarkers = markers;
      if (clusteringInscriptions) {
        const cluster = L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 40,
          iconCreateFunction: (cluster) => {
            return L.divIcon({
              html: `<div class=\"cluster-marker\" style=\"background:${COLOR_OPTIONS[inscriptionColor]?.gradient || 'linear-gradient(135deg,#f85032 0%,#e73827 100%)'}\">${cluster.getChildCount()}</div>`,
              className: 'marker-cluster',
              iconSize: L.point(40, 40)
            });
          }
        });
        markers.forEach(marker => cluster.addLayer(marker));
        map.addLayer(cluster);
        markersRef.current.inscriptionCluster = cluster;
      } else {
        markers.forEach(marker => map.addLayer(marker));
      }
    }

    // 2. Herostones
    if (showHerostones) {
      let markers = [];
      const dataToUse = filteredData.length > 0 ? filteredHerostones : herostones;
      dataToUse.forEach(item => {
        const marker = createMarker(item, 'herostone');
        if (marker) markers.push(marker);
      });
      markersRef.current.herostoneMarkers = markers;
      if (clusteringHerostones) {
        const cluster = L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 40,
          iconCreateFunction: (cluster) => {
            return L.divIcon({
              html: `<div class=\"cluster-marker\" style=\"background:${COLOR_OPTIONS[herostoneColor]?.gradient || 'linear-gradient(135deg,#a259c4 0%,#7b2ff2 100%)'}\">${cluster.getChildCount()}</div>`,
              className: 'marker-cluster',
              iconSize: L.point(40, 40)
            });
          }
        });
        markers.forEach(marker => cluster.addLayer(marker));
        map.addLayer(cluster);
        markersRef.current.herostoneCluster = cluster;
      } else {
        markers.forEach(marker => map.addLayer(marker));
      }
    }

    // 3. Temples
    if (showTemples) {
      let markers = [];
      const dataToUse = filteredData.length > 0 ? filteredTemples : temples;
      dataToUse.forEach(item => {
        const marker = createMarker(item, 'temple');
        if (marker) markers.push(marker);
      });
      markersRef.current.templeMarkers = markers;
      if (clusteringTemples) {
        const cluster = L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 40,
          iconCreateFunction: (cluster) => {
            return L.divIcon({
              html: `<div class=\"cluster-marker\" style=\"background:${COLOR_OPTIONS[templeColor]?.gradient || 'linear-gradient(135deg,#ffd200 0%,#f7971e 100%)'}\">${cluster.getChildCount()}</div>`,
              className: 'marker-cluster',
              iconSize: L.point(40, 40)
            });
          }
        });
        markers.forEach(marker => cluster.addLayer(marker));
        map.addLayer(cluster);
        markersRef.current.templeCluster = cluster;
      } else {
        markers.forEach(marker => map.addLayer(marker));
      }
    }
  }, [
    herostones, temples, inscriptions, 
    showHerostones, showTemples, showInscriptions,
    clusteringHerostones, clusteringInscriptions, clusteringTemples,
    herostoneColor, herostoneSize, herostoneOpacity,
    inscriptionColor, inscriptionSize, inscriptionOpacity,
    templeColor, templeSize, templeOpacity,
    setSelectedSite, setSidebarOpen
  ]);
  
  // Update basemap when selection changes
  React.useEffect(() => {
    if (!leafletMapRef.current || !markersRef.current.basemapLayer) return;
    
    const map = leafletMapRef.current;
    
    // Remove existing basemap
    map.removeLayer(markersRef.current.basemapLayer);
    
    // Add new basemap based on selected type
    let layer;
    switch (basemap) {
      case 'satellite':
        layer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OSM Team hosted by OpenStreetMap France'
        });
        break;
      case 'terrain':
        layer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17,
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
        });
        break;
      case 'default':
      case 'osm':
      default:
        layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        break;
    }
    // Set opacity and add to map
    layer.setOpacity(opacity);
    layer.addTo(map);
    markersRef.current.basemapLayer = layer;
    
  }, [basemap]);
  
  // Update opacity when it changes
  React.useEffect(() => {
    if (markersRef.current.basemapLayer) {
      markersRef.current.basemapLayer.setOpacity(opacity);
    }
  }, [opacity]);
  
  return (
    <div id="map" ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
  );
}

// Make MapComponent available globally
window.MapComponent = MapComponent;
