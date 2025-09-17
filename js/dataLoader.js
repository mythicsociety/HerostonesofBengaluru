
/**
 * dataLoader.js
 * Utility functions for loading data (CSV, GeoJSON, etc.) in WebGIS
 * All logic preserved, only code style and comments improved.
 */

/**
 * Loads a CSV file using PapaParse and returns the parsed data via callback.
 * @param {string} path - Path to the CSV file
 * @param {function} callback - Function to call with parsed data
 */
function loadCSV(path, callback) {
  if (typeof Papa === 'undefined') {
    console.error('PapaParse library is not loaded.');
    return;
  }
  Papa.parse(path, {
    download: true,
    header: true,
    complete: function(results) {
      if (typeof callback === 'function') {
        callback(results.data);
      }
    }
  });
}

// Future: Add more data loading utilities here (e.g., loadGeoJSON, loadJSON)
