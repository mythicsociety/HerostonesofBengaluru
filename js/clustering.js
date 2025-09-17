/**
 * clustering.js
 * Marker clustering logic for WebGIS
 * All logic preserved, only code style and comments improved.
 */

// Configuration for cluster styles
const CLUSTER_CONFIG = {
    Herostones: {
        color: '#0074D9',
       
        color: '#FF851B',
        textColor: '#ffffff'
    },
    Temples: {
        color: '#e63946',
        textColor: '#ffffff'
    }
};

// Track clustering state
window.clusteringState = {
    Herostones: false,
    Inscriptions: false,
    Temples: false
};

// Initialize cluster groups
window.initClusters = function() {
    // Herostones cluster
    window.herostonesCluster = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        animate: true,
        animateAddingMarkers: true,
        // Add custom class for color
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();
          var c = ' marker-cluster-herostones';
          return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
        }
    });
    
    // Inscriptions cluster
    window.inscriptionsCluster = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        animate: true,
        animateAddingMarkers: true,
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();
          var c = ' marker-cluster-inscriptions';
          return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
        }
    });
    
    // Temples cluster
    window.templesCluster = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        animate: true,
        animateAddingMarkers: true,
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();
          var c = ' marker-cluster-temples';
          return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
        }
    });
    
    console.log('Cluster groups initialized');
};

// Create cluster icon function for a layer
function createClusterIconFunction(layerName) {
    const config = CLUSTER_CONFIG[layerName] || { 
        color: '#007bff', 
        textColor: '#ffffff' 
    };
    
    return function(cluster) {
        const count = cluster.getChildCount();
        let size;
        
        // Dynamic sizing based on count
        if (count < 10) size = 36;
        else if (count < 100) size = 44;
        else if (count < 1000) size = 52;
        else size = 60;
        
        // Create HTML for the icon
        return L.divIcon({
            html: `
                <div style="
                    background-color: ${config.color};
                    color: ${config.textColor};
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${count >= 1000 ? '12px' : count >= 100 ? '14px' : '16px'};
                    border: 2px solid white;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                ">
                    ${formatClusterNumber(count)}
                </div>
            `,
            className: `marker-cluster marker-cluster-${layerName.toLowerCase()}`,
            iconSize: L.point(size, size),
            iconAnchor: L.point(size/2, size/2)
        });
    };
}

// Format large numbers in clusters
function formatClusterNumber(count) {
    if (count >= 1000) {
        return Math.round(count/100)/10 + 'k';
    }
    return count;
}

// Toggle clustering for a layer
window.setLayerClustering = function(layerName, enableClustering) {
    // Update state
    window.clusteringState[layerName] = enableClustering;
    
    // Get references to regular and cluster layers
    let regularLayer, clusterLayer;
    
    if (layerName === 'Herostones') {
        regularLayer = window.herostonesLayer;
        clusterLayer = window.herostonesCluster;
    } else if (layerName === 'Inscriptions') {
        regularLayer = window.inscriptionsLayer;
        clusterLayer = window.inscriptionsCluster;
    } else if (layerName === 'Temples') {
        regularLayer = window.templesLayer;
        clusterLayer = window.templesCluster;
    } else {
        console.error('Unknown layer name:', layerName);
        return;
    }
    
    // Check if the layer is visible at all
    const layerCheckbox = document.getElementById('layer' + layerName);
    const isVisible = layerCheckbox && layerCheckbox.checked;
    
    // Don't proceed if the layer is not visible
    if (!isVisible) {
        console.log(`Layer ${layerName} is not visible, skipping clustering`);
        return;
    }
    
    // Make sure the data is loaded
    if (!window[`_${layerName.toLowerCase()}Loaded`]) {
        window.loadLayerGeoJSON(layerName);
        return;
    }
    
    // Remove both layers from map
    if (window.map.hasLayer(regularLayer)) {
        window.map.removeLayer(regularLayer);
    }
    
    if (window.map.hasLayer(clusterLayer)) {
        window.map.removeLayer(clusterLayer);
    }
    
    if (enableClustering) {
        // Update cluster layer with markers from regular layer
        clusterLayer.clearLayers();
        const markers = regularLayer.getLayers();
        
        // Add markers to cluster layer
        if (markers.length > 0) {
            clusterLayer.addLayers(markers);
            window.map.addLayer(clusterLayer);
            window.showNotification(`Clustering enabled for ${layerName}`, 'info', 2000);
        } else {
            window.showNotification(`No markers available to cluster for ${layerName}`, 'warning');
        }
    } else {
        // Add regular layer to map
        window.map.addLayer(regularLayer);
        window.showNotification(`Clustering disabled for ${layerName}`, 'info', 2000);
    }
    
    // Update checkbox state
    const clusterCheckbox = document.getElementById('cluster' + layerName);
    if (clusterCheckbox) {
        clusterCheckbox.checked = enableClustering;
    }
};

// Modified version of setLayerVisibility that respects clustering state
window.originalSetLayerVisibility = window.setLayerVisibility;
window.setLayerVisibility = function(layerName, visible) {
    // Remove both regular and clustered layers from map
    let regularLayer, clusterLayer;
    
    if (layerName === 'Herostones') {
        regularLayer = window.herostonesLayer;
        clusterLayer = window.herostonesCluster;
    } else if (layerName === 'Inscriptions') {
        regularLayer = window.inscriptionsLayer;
        clusterLayer = window.inscriptionsCluster;
    } else if (layerName === 'Temples') {
        regularLayer = window.templesLayer;
        clusterLayer = window.templesCluster;
    }
    
    if (regularLayer && window.map.hasLayer(regularLayer)) {
        window.map.removeLayer(regularLayer);
    }
    
    if (clusterLayer && window.map.hasLayer(clusterLayer)) {
        window.map.removeLayer(clusterLayer);
    }
    
    // If we're setting to visible
    if (visible) {
        // Make sure data is loaded
        if (!window[`_${layerName.toLowerCase()}Loaded`]) {
            window.loadLayerGeoJSON(layerName);
        }
        
        // Apply clustering based on state
        if (window.clusteringState[layerName]) {
            if (clusterLayer) {
                // If data is already loaded, make sure cluster has markers
                if (window[`_${layerName.toLowerCase()}Loaded`] && regularLayer) {
                    clusterLayer.clearLayers();
                    const markers = regularLayer.getLayers();
                    if (markers.length > 0) {
                        clusterLayer.addLayers(markers);
                    }
                }
                window.map.addLayer(clusterLayer);
            }
        } else {
            if (regularLayer) {
                window.map.addLayer(regularLayer);
            }
        }
    }
    
    // Update checkbox
    const layerCheckbox = document.getElementById('layer' + layerName);
    if (layerCheckbox) {
        layerCheckbox.checked = visible;
    }
    
    // Update state
    if (window.AppState) {
        const layers = window.AppState.get('layers');
        if (layers && layers[layerName]) {
            window.AppState.update('layers', { 
                [layerName]: { ...layers[layerName], visible: visible } 
            });
        }
    } else if (window.State && window.State.layers) {
        window.State.layers[layerName] = visible;
    }
    
    // Update cluster checkbox enabled/disabled state
    const clusterCheckbox = document.getElementById('cluster' + layerName);
    if (clusterCheckbox) {
        clusterCheckbox.disabled = !visible;
        if (!visible) clusterCheckbox.checked = false;
    }
};

// Initialize clustering on document ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait until Leaflet and map are initialized
    setTimeout(function() {
        if (window.L && window.map) {
            window.initClusters();
            
            // Attach event handlers for cluster checkboxes
            ['Herostones', 'Inscriptions', 'Temples'].forEach(function(layerName) {
                const clusterCheckbox = document.getElementById('cluster' + layerName);
                if (clusterCheckbox) {
                    // Remove any existing event handlers
                    const newCheckbox = clusterCheckbox.cloneNode(true);
                    clusterCheckbox.parentNode.replaceChild(newCheckbox, clusterCheckbox);
                    
                    // Add our improved handler
                    newCheckbox.addEventListener('change', function(e) {
                        const layerCheckbox = document.getElementById('layer' + layerName);
                        const isVisible = layerCheckbox && layerCheckbox.checked;
                        
                        if (!isVisible) {
                            e.preventDefault();
                            newCheckbox.checked = false;
                            window.showNotification(`${layerName} layer must be visible to enable clustering`, 'warning');
                            return;
                        }
                        
                        window.setLayerClustering(layerName, newCheckbox.checked);
                    });
                }
            });
        }
    }, 1000); // Give map time to initialize
});

/**
 * clustering.js
 * Marker clustering logic for WebGIS
 * All logic preserved, only code style and comments improved.
 */
