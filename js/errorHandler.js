/**
 * errorHandler.js - Improved error handling and loading indicators for WebGIS
 */

// Create container for notifications if it doesn't exist
function ensureNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = 'position:fixed;top:70px;right:10px;z-index:2000;max-width:350px;';
        document.body.appendChild(container);
    }
    return container;
}

// Create loading indicator container
function ensureLoadingContainer() {
    let container = document.getElementById('loading-indicator-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'loading-indicator-container';
        container.style.cssText = 'position:fixed;top:70px;left:10px;z-index:2000;background:rgba(255,255,255,0.9);border-radius:4px;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,0.15);';
        document.body.appendChild(container);
    }
    return container;
}

// Show a notification to the user
window.showNotification = function(message, type = 'info', duration = 5000) {
    const container = ensureNotificationContainer();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.style.cssText = `
        margin-bottom:10px;
        padding:12px 15px;
        border-radius:4px;
        box-shadow:0 2px 8px rgba(0,0,0,0.15);
        animation:fadeIn 0.3s ease;
        display:flex;
        align-items:center;
        justify-content:space-between;
    `;
    
    // Add different styling based on type
    if (type === 'error') {
        notification.style.backgroundColor = '#f8d7da';
        notification.style.color = '#721c24';
        notification.style.borderLeft = '4px solid #dc3545';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#fff3cd';
        notification.style.color = '#856404';
        notification.style.borderLeft = '4px solid #ffc107';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#d4edda';
        notification.style.color = '#155724';
        notification.style.borderLeft = '4px solid #28a745';
    } else {
        notification.style.backgroundColor = '#cce5ff';
        notification.style.color = '#004085';
        notification.style.borderLeft = '4px solid #007bff';
    }
    
    // Add content
    const content = document.createElement('div');
    content.style.flexGrow = '1';
    content.innerHTML = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'background:none;border:none;font-size:1.5rem;font-weight:700;line-height:1;color:inherit;opacity:0.7;cursor:pointer;margin-left:10px;';
    closeBtn.addEventListener('click', function() {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add hover effect
    notification.addEventListener('mouseenter', function() {
        closeBtn.style.opacity = '1';
    });
    notification.addEventListener('mouseleave', function() {
        closeBtn.style.opacity = '0.7';
    });
    
    // Add elements to notification
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    // Add notification to container
    container.appendChild(notification);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    // Add CSS animation if not already added
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .notification {
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * errorHandler.js
     * Error handling and loading indicator utilities for WebGIS
     * All logic preserved, only code style and comments improved.
     */
    return notification;
};

// Show loading indicator
window.showLoading = function(message = 'Loading data...', id = 'default') {
    const container = ensureLoadingContainer();
    
    // If loading indicator with this ID already exists, update message
    let loadingItem = document.getElementById('loading-' + id);
    if (loadingItem) {
        loadingItem.querySelector('.loading-message').textContent = message;
        return loadingItem;
    }
    
    // Create new loading indicator
    loadingItem = document.createElement('div');
    loadingItem.id = 'loading-' + id;
    loadingItem.className = 'loading-indicator';
    loadingItem.style.cssText = 'display:flex;align-items:center;margin-bottom:8px;';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = 'width:20px;height:20px;border:2px solid rgba(0,123,255,0.2);border-left-color:#007bff;border-radius:50%;animation:spin 1s linear infinite;margin-right:10px;';
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.className = 'loading-message';
    messageSpan.textContent = message;
    
    // Add animation style if not already added
    if (!document.getElementById('loading-style')) {
        const style = document.createElement('style');
        style.id = 'loading-style';
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add elements to indicator
    loadingItem.appendChild(spinner);
    loadingItem.appendChild(messageSpan);
    
    // Add to container and show container
    container.appendChild(loadingItem);
    container.style.display = 'block';
    
    return loadingItem;
};

// Hide loading indicator
window.hideLoading = function(id = 'default') {
    const loadingItem = document.getElementById('loading-' + id);
    if (loadingItem) {
        loadingItem.remove();
        
        // If no more loading indicators, hide container
        const container = document.getElementById('loading-indicator-container');
        if (container && container.children.length === 0) {
            container.style.display = 'none';
        }
    }
};

// Improved GeoJSON loading function
window.loadGeoJSON = function(url, callback, errorCallback) {
    const filename = url.split('/').pop();
    const loadingId = 'geojson-' + filename.replace(/\W/g, '-');
    
    // Show loading indicator
    window.showLoading(`Loading ${filename}...`, loadingId);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filename} (Status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            window.hideLoading(loadingId);
            
            if (data && data.features && data.features.length > 0) {
                window.showNotification(`Successfully loaded ${data.features.length} features from ${filename}`, 'success', 2000);
                if (typeof callback === 'function') callback(data);
            } else {
                window.showNotification(`Warning: ${filename} loaded but contains no features`, 'warning');
                if (typeof callback === 'function') callback(data);
            }
        })
        .catch(error => {
            window.hideLoading(loadingId);
            console.error(`Error loading ${url}:`, error);
            window.showNotification(`Error loading ${filename}: ${error.message}`, 'error');
            
            // Try lowercase filename as fallback for common GeoJSON files
            if (url.includes('/geojson/') && 
                (url.includes('Herostones.geojson') || 
                 url.includes('Inscriptions.geojson') || 
                 url.includes('Temples.geojson'))) {
                
                const lowercaseUrl = url.replace(/([A-Z])/g, char => char.toLowerCase());
                
                if (lowercaseUrl !== url) {
                    window.showNotification(`Trying alternative filename: ${lowercaseUrl.split('/').pop()}`, 'info');
                    window.loadGeoJSON(lowercaseUrl, callback, errorCallback);
                    return;
                }
            }
            
            if (typeof errorCallback === 'function') errorCallback(error);
        });
};

// Enhanced loadLayerGeoJSON function to use our improved error handling
window.loadLayerGeoJSON = function(layerName) {
    // Return early if already loading
    if (window[`_${layerName.toLowerCase()}Loading`]) return;
    
    // Set loading flag
    window[`_${layerName.toLowerCase()}Loading`] = true;
    
    window.loadGeoJSON(`geojson/${layerName}.geojson`, 
        // Success callback
        function(data) {
            // Clear loading flag
            window[`_${layerName.toLowerCase()}Loading`] = false;
            
            // Store data in global variable
            window[`${layerName.toLowerCase()}Geojson`] = data;
            
            // Handle the layer based on the name
            let layer = null;
            if (layerName === 'Herostones') layer = window.herostonesLayer;
            else if (layerName === 'Inscriptions') layer = window.inscriptionsLayer;
            else if (layerName === 'Temples') layer = window.templesLayer;
            
            if (layer) {
                // Clear existing layers
                layer.clearLayers();
                
                // Add data to layer
                layer.addData(data);
                
                // Mark as loaded
                window[`_${layerName.toLowerCase()}Loaded`] = true;
                
                // Apply any filters
                if (typeof window.applyHeritageSitesFilter === 'function') {
                    window.applyHeritageSitesFilter();
                }
                
                // If clustering is enabled for this layer, handle it
                const clusterCheckbox = document.getElementById(`cluster${layerName}`);
                if (clusterCheckbox && clusterCheckbox.checked && typeof window.setLayerClustering === 'function') {
                    window.setLayerClustering(layerName, true);
                }
                
                // Update features dropdowns if needed
                if (typeof window.renderFeaturesDropdowns === 'function') {
                    window.renderFeaturesDropdowns();
                }
            }
        },
        // Error callback
        function(error) {
            // Clear loading flag
            window[`_${layerName.toLowerCase()}Loading`] = false;
            
            // Mark as not loaded
            window[`_${layerName.toLowerCase()}Loaded`] = false;
            
            // Show user-friendly error
            window.showNotification(`Failed to load ${layerName} data. Please check the console for details.`, 'error');
        }
    );
};

// Initialize error handlers on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Error handling system initialized');
});
