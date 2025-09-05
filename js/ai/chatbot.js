// chatbot.js
// Connects chat UI to AI and spatial logic
// chatbot.js
// Connects chat UI to AI and spatial logic

// Example main handler
window.handleUserQuery = async function(query, features, namedLocations) {
    const { entities, intent, distance } = await window.extractIntentEntities(query);
    let results = features;

    // Example: handle 'find_near' intent
    if (intent === 'find_near' && entities.length > 1) {
        // Assume entities[0] = type, entities[1] = location
        const type = entities[0];
        const locationName = entities[1];
        const center = namedLocations[locationName]; // [lng, lat]
        if (center && distance) {
            results = window.filterByType(features, type);
            results = window.filterByDistance(results, center, distance);
        }
    }
    // Add more intent handling as needed

    return results;
};
