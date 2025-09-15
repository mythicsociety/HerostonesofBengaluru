/**
 * state.js
 * Centralized state management for WebGIS application
 */

const AppState = (function() {
  // Private state object
  const _state = {
    // Map state
    map: {
      center: [12.9716, 77.5946], // Default center (Bengaluru)
      zoom: 11, // Default zoom level
      basemap: 'OSM Standard'
    },
    
    // UI state
    ui: {
      leftPanelExpanded: true,
      rightPanelExpanded: true,
      leftActiveTab: 'tab-layers',
      rightActiveTab: 'tab-1',
      isMobile: false
    },
    
    // Layer visibility
    layers: {
      Herostones: {
        visible: true,
        clustered: false
      },
      Inscriptions: {
        visible: true,
        clustered: false
      },
      Temples: {
        visible: true,
        clustered: false
      },
      Districts: {
        visible: false,
        selected: []
      },
      Taluks: {
        visible: false,
        selected: []
      }
    },
    
    // Filters
    filters: {},
    
    // Search and selection
    selection: {
      layer: null,
      feature: null,
      properties: null,
      lastSearch: null,
      searchResults: []
    },
    
    // For backward compatibility
    uploadedLayers: []
  };

  // List of registered state change listeners
  const listeners = {
    map: [],
    ui: [],
    layers: [],
    filters: [],
    selection: []
  };

  // Local storage key
  const STORAGE_KEY = 'webgis-app-state';

  // Initialize state
  function init() {
    // Load saved state from localStorage if available
    loadState();
    
    // Check device type for initial UI state
    _state.ui.isMobile = window.innerWidth <= 768;
    
    // If on mobile, don't have both panels expanded by default
    if (_state.ui.isMobile && _state.ui.leftPanelExpanded && _state.ui.rightPanelExpanded) {
      _state.ui.rightPanelExpanded = false;
    }
    
    // Listen for window resize events
    window.addEventListener('resize', () => {
      const wasMobile = _state.ui.isMobile;
      _state.ui.isMobile = window.innerWidth <= 768;
      
      // If device type changed, notify listeners
      if (wasMobile !== _state.ui.isMobile) {
        notifyListeners('ui');
      }
    });
    
    // Set up periodic state saving
    setInterval(saveState, 5000);
    
    // Save state before unload
    window.addEventListener('beforeunload', saveState);
    
    console.log("State management initialized");
    return true;
  }

  // Update state based on key path and new values
  function updateState(path, newValues) {
    if (!path || typeof newValues !== 'object') {
      console.error("Invalid state update parameters");
      return false;
    }
    
    // Check if path is valid
    if (!_state[path]) {
      console.error(`Invalid state path: ${path}`);
      return false;
    }
    
    // Update the state object
    Object.assign(_state[path], newValues);
    
    // Notify listeners
    notifyListeners(path);
    
    // Save state
    saveState();
    
    return true;
  }

  // Get current state (read-only copy)
  function getState(path) {
    if (!path) {
      // Return a deep copy of the entire state
      return JSON.parse(JSON.stringify(_state));
    }
    
    if (!_state[path]) {
      console.error(`Invalid state path: ${path}`);
      return null;
    }
    
    // Return a deep copy of the requested path
    return JSON.parse(JSON.stringify(_state[path]));
  }

  // Subscribe to state changes
  function subscribe(path, callback) {
    if (!listeners[path]) {
      console.error(`Cannot subscribe to invalid path: ${path}`);
      return false;
    }
    
    if (typeof callback !== 'function') {
      console.error("Callback must be a function");
      return false;
    }
    
    listeners[path].push(callback);
    return true;
  }

  // Unsubscribe from state changes
  function unsubscribe(path, callback) {
    if (!listeners[path]) {
      return false;
    }
    
    const index = listeners[path].indexOf(callback);
    if (index !== -1) {
      listeners[path].splice(index, 1);
      return true;
    }
    
    return false;
  }

  // Notify all listeners of a state change
  function notifyListeners(path) {
    if (!listeners[path]) {
      return;
    }
    
    const stateCopy = getState(path);
    listeners[path].forEach(callback => {
      try {
        callback(stateCopy);
      } catch (err) {
        console.error("Error in state change listener:", err);
      }
    });
  }

  // Save state to localStorage
  function saveState() {
    try {
      // We don't need to save everything - just the important parts
      const savedState = {
        map: {
          center: _state.map.center,
          zoom: _state.map.zoom,
          basemap: _state.map.basemap
        },
        ui: {
          leftPanelExpanded: _state.ui.leftPanelExpanded,
          rightPanelExpanded: _state.ui.rightPanelExpanded,
          leftActiveTab: _state.ui.leftActiveTab,
          rightActiveTab: _state.ui.rightActiveTab
        },
        layers: _state.layers,
        filters: _state.filters
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    } catch (err) {
      console.warn("Failed to save state to localStorage:", err);
    }
  }

  // Load state from localStorage
  function loadState() {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        
        // Restore each section of the state if it exists
        if (parsed.map) Object.assign(_state.map, parsed.map);
        if (parsed.ui) Object.assign(_state.ui, parsed.ui);
        if (parsed.layers) Object.assign(_state.layers, parsed.layers);
        if (parsed.filters) Object.assign(_state.filters, parsed.filters);
      }
    } catch (err) {
      console.warn("Failed to load state from localStorage:", err);
    }
  }

  // Clear saved state
  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear state from localStorage:", err);
    }
  }

  // Public API
  return {
    init: init,
    update: updateState,
    get: getState,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    save: saveState,
    load: loadState,
    clear: clearState
  };
})();

// For backward compatibility
var State = {
  layers: { Herostones:true, Temples:true, Inscriptions:true },
  selectedFeature: null,
  filters: {},
  uploadedLayers: []
};

// Initialize state management when document is ready
document.addEventListener('DOMContentLoaded', function() {
  AppState.init();
  
  // Sync with old State object for backward compatibility
  AppState.subscribe('layers', function(layers) {
    State.layers.Herostones = layers.Herostones.visible;
    State.layers.Inscriptions = layers.Inscriptions.visible;
    State.layers.Temples = layers.Temples.visible;
  });
  
  AppState.subscribe('selection', function(selection) {
    State.selectedFeature = selection.feature;
  });
  
  AppState.subscribe('filters', function(filters) {
    State.filters = filters;
  });
});
