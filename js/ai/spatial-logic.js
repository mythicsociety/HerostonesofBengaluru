// spatial-logic.js
// Handles spatial filtering and analysis using Turf.js

// Assumes turf is loaded globally as turf

window.filterByDistance = function(features, center, distanceMeters) {
    // Returns features within distanceMeters of center [lng, lat]
    return features.filter(f => {
        const coords = f.geometry.coordinates;
        const dist = turf.distance(center, coords, { units: 'meters' });
        return dist <= distanceMeters;
    });
};

window.filterByType = function(features, type) {
    // Returns features matching a given type/category
    return features.filter(f => {
        return f.properties && f.properties.type && f.properties.type.toLowerCase().includes(type.toLowerCase());
    });
};
