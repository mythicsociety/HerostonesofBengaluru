/**
 * popupFormatter.js - Improved popup formatting for WebGIS
 */

// Configuration for important fields to display first for each layer type
const IMPORTANT_FIELDS = {
    Herostones: ['Name', 'Description', 'Date', 'Period', 'District_KGIS', 'Taluk_KGIS', 'Village'],
    Inscriptions: ['Name', 'Description', 'Period', 'Script', 'Language', 'District_KGIS', 'Taluk_KGIS', 'Village'],
    Temples: ['Name', 'Description', 'Period', 'Style', 'Deity', 'District_KGIS', 'Taluk_KGIS', 'Village']
};

// Fields to exclude from popups (like internal IDs, coordinates that are redundant, etc.)
const EXCLUDED_FIELDS = [
    'id', 'ID', 'fid', 'FID', 'OBJECTID', 'objectid',
    'lat', 'latitude', 'Latitude', 'LAT', 
    'lon', 'lng', 'longitude', 'Longitude', 'LONG',
    'x', 'X', 'y', 'Y', 'geom', 'geometry'
];

// Field labels mapping for nicer display (camelCase or snake_case to Title Case)
const FIELD_LABELS = {
    'District_KGIS': 'District',
    'Taluk_KGIS': 'Taluk'
};

// Format a single field value for display
function formatFieldValue(value, fieldName) {
    if (value === null || value === undefined) return '<em>Not available</em>';
    
    // Format specific field types
    if (typeof value === 'string') {
        // Dates - attempt to format if it looks like a date
        if (/^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString();
                }
            } catch (e) {
                // If date parsing fails, return original value
                console.log('Date parsing failed for:', value);
            }
        }
        
        // URLs - make clickable
        if (value.startsWith('http://') || value.startsWith('https://')) {
            return `<a href="${value}" target="_blank" rel="noopener">${value}</a>`;
        }
        
        // Email addresses - make clickable
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return `<a href="mailto:${value}">${value}</a>`;
        }
    }
    
    // Numeric values - format with commas for thousands
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    
    // Boolean values - show as Yes/No
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    
    // Default formatting (convert to string)
    return String(value);
}

// Generate a formatted popup content from feature properties
window.createFormattedPopup = function(feature, layerName) {
    const props = feature.properties || {};
    
    // Start building HTML content
    let html = '<div class="formatted-popup">';
    
    // Add title if available
    const title = props.Name || props.name || props.Title || props.title || props.TITLE || 
                 `${layerName} Feature`;
    html += `<h4 class="popup-title">${title}</h4>`;
    
    // Format table for important fields first
    html += '<table class="popup-table">';
    
    // Track which fields we've already added
    const addedFields = new Set();
    
    // Add important fields first if they exist
    const importantFields = IMPORTANT_FIELDS[layerName] || [];
    importantFields.forEach(field => {
        // Check for various cases (exact match, lowercase, uppercase)
        const matchingKey = Object.keys(props).find(
            key => key === field || key.toLowerCase() === field.toLowerCase()
        );
        
        if (matchingKey && !EXCLUDED_FIELDS.includes(matchingKey)) {
            const label = FIELD_LABELS[matchingKey] || formatFieldLabel(matchingKey);
            const value = formatFieldValue(props[matchingKey], matchingKey);
            
            html += `<tr>
                <th>${label}:</th>
                <td>${value}</td>
            </tr>`;
            
            // Mark as added
            addedFields.add(matchingKey);
        }
    });
    
    // Add remaining fields (sorted alphabetically)
    const remainingFields = Object.keys(props)
        .filter(key => !addedFields.has(key) && !EXCLUDED_FIELDS.includes(key))
        .sort();
    
    if (remainingFields.length > 0) {
        // Add a separator if we have both important and remaining fields
        if (addedFields.size > 0) {
            html += `<tr><td colspan="2" class="popup-separator"></td></tr>`;
        }
        
        // Add remaining fields
        remainingFields.forEach(key => {
            const label = FIELD_LABELS[key] || formatFieldLabel(key);
            const value = formatFieldValue(props[key], key);
            
            html += `<tr>
                <th>${label}:</th>
                <td>${value}</td>
            </tr>`;
        });
    }
    
    html += '</table>';
    
    // Add coordinates from the feature geometry
    if (feature.geometry && feature.geometry.type === 'Point' && 
        feature.geometry.coordinates && feature.geometry.coordinates.length >= 2) {
        const [lng, lat] = feature.geometry.coordinates;
        html += `
            <div class="popup-coordinates">
                <small>
                    <strong>Coordinates:</strong> 
                    ${lat.toFixed(6)}°, ${lng.toFixed(6)}°
                </small>
            </div>`;
    }
    
    // Close the container
    html += '</div>';
    
    // Add CSS if not already present
    ensurePopupStyles();
    
    return html;
};

// Format field name to Title Case with spaces instead of camelCase or snake_case
function formatFieldLabel(field) {
    return field
        // Add spaces before uppercase letters in camelCase
        .replace(/([A-Z])/g, ' $1')
        // Replace underscores with spaces
        .replace(/_/g, ' ')
        // Clean up any double spaces
        .replace(/\s+/g, ' ')
        // Uppercase first letter
        .replace(/^\w/, c => c.toUpperCase())
        // Trim any leading/trailing spaces
        .trim();
}

// Ensure popup styles are added to the document
function ensurePopupStyles() {
    if (!document.getElementById('popup-styles')) {
        const style = document.createElement('style');
        style.id = 'popup-styles';
        style.textContent = `
            .formatted-popup {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                max-width: 300px;
            }
            
            .popup-title {
                margin: 0 0 10px 0;
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
                padding-bottom: 6px;
                border-bottom: 1px solid #eee;
            }
            
            .popup-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            
            .popup-table th {
                text-align: left;
                padding: 4px 8px 4px 0;
                vertical-align: top;
                color: #555;
                font-weight: 600;
                width: 35%;
            }
            
            .popup-table td {
                padding: 4px 0;
                vertical-align: top;
            }
            
            .popup-table a {
                color: #007bff;
                text-decoration: none;
            }
            
            .popup-table a:hover {
                text-decoration: underline;
            }
            
            .popup-separator {
                height: 8px;
            }
            
            .popup-coordinates {
                margin-top: 10px;
                border-top: 1px solid #eee;
                padding-top: 8px;
                font-size: 11px;
                color: #666;
            }
            
            /* Responsive adjustments */
            @media (max-width: 576px) {
                .formatted-popup {
                    max-width: 240px;
                }
                
                .popup-table th,
                .popup-table td {
                    display: block;
                    width: 100%;
                }
                
                .popup-table th {
                    padding-bottom: 0;
                }
                
                .popup-table td {
                    padding-bottom: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup formatter initialized');
});
