// ai-intent.js
// Handles query parsing and entity extraction using Transformers.js

// Placeholder: Load and initialize Transformers.js model here
// Example: const model = await pipeline('ner', 'Xenova/bert-base-NER');

// Rule-based intent/entity extraction for Basic AI mode

// --- Auto-generated keyword lists from heritage.json ---
// These lists should be updated if your data changes
let TYPE_KEYWORDS = [
  "palace", "temple", "herostone", "inscription", "church", "mosque", "summer palace", "vidhana soudha"
];
let SUBTYPE_KEYWORDS = [
  // Add subtypes from your data if available
  "tudor", "indo-islamic", "legislature", "vishnu", "shiva", "sati", "hero", "jain", "buddha"
];
let LOCATION_KEYWORDS = [
  "bangalore palace", "tipu sultan's summer palace", "vidhana soudha", "cubbon park", "lalbagh", "bengaluru", "bangalore", "malleshwaram"
];

// --- Debug: Log the keyword lists for troubleshooting ---
// console.log('[AI-Intent] TYPE_KEYWORDS:', TYPE_KEYWORDS);
// console.log('[AI-Intent] SUBTYPE_KEYWORDS:', SUBTYPE_KEYWORDS);
// console.log('[AI-Intent] LOCATION_KEYWORDS:', LOCATION_KEYWORDS);

// --- Fuzzy matching with Fuse.js ---
// Make sure Fuse.js is loaded in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>

// Create Fuse.js instances for fuzzy search
let typeFuse = new Fuse(TYPE_KEYWORDS, { threshold: 0.6 });
let subtypeFuse = new Fuse(SUBTYPE_KEYWORDS, { threshold: 0.6 });
let locationFuse = new Fuse(LOCATION_KEYWORDS, { threshold: 0.6 });

// --- Debug: Log what is being matched ---
function fuzzyFind(query, fuseInstance, label) {
  const result = fuseInstance.search(query.toLowerCase());
  if (result.length > 0 && (result[0].score === undefined || result[0].score <= 0.6)) {
    console.log(`[AI-Intent] Matched ${label}:`, result[0].item, 'score:', result[0].score);
    return result[0].item;
  }
  console.log(`[AI-Intent] No match for ${label} in:`, query);
  return null;
}

// --- Improved fuzzy matching: lower threshold, plural support, word-by-word matching ---
function fuzzyFindAnyWord(query, fuseInstance, label) {
  // Try full query first
  let result = fuseInstance.search(query.toLowerCase());
  if (result.length > 0 && (result[0].score === undefined || result[0].score <= 0.6)) {
    console.log(`[AI-Intent] Matched ${label} (full):`, result[0].item, 'score:', result[0].score);
    return result[0].item;
  }
  // Try each word (and its singular form)
  const words = query.toLowerCase().split(/\W+/);
  for (let word of words) {
    if (!word) continue;
    // Try plural to singular (basic)
    let singular = word.endsWith('s') ? word.slice(0, -1) : word;
    let tries = [word, singular];
    for (let tryWord of tries) {
      let r = fuseInstance.search(tryWord);
      if (r.length > 0 && (r[0].score === undefined || r[0].score <= 0.6)) {
        console.log(`[AI-Intent] Matched ${label} (word):`, r[0].item, 'score:', r[0].score);
        return r[0].item;
      }
    }
  }
  console.log(`[AI-Intent] No match for ${label} in:`, query);
  return null;
}

// --- Advanced matching: normalize, substring, typo correction, multi-word, looser threshold ---
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove punctuation
    .replace(/\s+/g, ' ') // collapse spaces
    .trim();
}

// Simple typo correction map (expand as needed)
const TYPO_MAP = {
  'lalbhag': 'lalbagh',
  'vidhana soudha': 'vidhana soudha', // example, can add more
};
function correctTypos(word) {
  return TYPO_MAP[word] || word;
}

function advancedMatch(query, keywordList, label) {
  const normQuery = normalize(query);
  console.log(`[AI-Intent] Query for ${label}:`, normQuery);
  // Try full query
  for (let kw of keywordList) {
    if (normQuery.includes(kw) || kw.includes(normQuery)) {
      console.log(`[AI-Intent] Substring match for ${label}:`, kw);
      return kw;
    }
  }
  // Try each word
  for (let word of normQuery.split(' ')) {
    word = correctTypos(word);
    for (let kw of keywordList) {
      if (word === kw || kw.includes(word) || word.includes(kw)) {
        console.log(`[AI-Intent] Word match for ${label}:`, kw);
        return kw;
      }
    }
  }
  // Try fuzzy (looser threshold)
  const fuse = new Fuse(keywordList, { threshold: 0.7 });
  const result = fuse.search(normQuery);
  if (result.length > 0) {
    console.log(`[AI-Intent] Fuzzy match for ${label}:`, result[0].item, 'score:', result[0].score);
    return result[0].item;
  }
  console.log(`[AI-Intent] No match for ${label} in:`, normQuery);
  return null;
}

window.extractIntentEntities = function(query) {
  // Always use latest lists
  const typeList = window.TYPE_KEYWORDS || [];
  const subtypeList = window.SUBTYPE_KEYWORDS || [];
  const locationList = window.LOCATION_KEYWORDS || [];
  const type = advancedMatch(query, typeList, 'type');
  const subtype = advancedMatch(query, subtypeList, 'subtype');
  const location = advancedMatch(query, locationList, 'location');
  const distance = (function(q) {
    const match = q.match(/(within|near|close to)?\s*(\d+(?:\.\d+)?)\s*(km|kilometers|meter|meters|m)/i);
    if (match) {
      let dist = parseFloat(match[2]);
      if (/km|kilometers/i.test(match[3])) dist *= 1000;
      return dist;
    }
    return null;
  })(query);
  if (type || subtype || location || distance) {
    return { type, subtype, location, distance };
  }
  return { type: null, subtype: null, location: null, distance: null };
};

// --- Dynamic keyword list generation from loaded data ---
// Call this after loading your data (e.g., after setTemples, setHerostones, etc.)
window.updateIntentKeywordLists = function({ temples = [], herostones = [], inscriptions = [] }) {
  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function uniqueFromField(arr, field) {
    const vals = arr.map(x => (x[field] || '').toString().toLowerCase()).filter(Boolean);
    // Add plural and singular forms
    return Array.from(new Set([
      ...vals,
      ...vals.map(v => v.endsWith('s') ? v.slice(0, -1) : v + 's')
    ].map(normalize)));
  }
  // Types
  const templeTypes = uniqueFromField(temples, 'Temple');
  const herostoneTypes = uniqueFromField(herostones, 'Type of Herostone');
  const inscriptionTypes = uniqueFromField(inscriptions, 'Type');
  // Subtypes
  const templeDeities = uniqueFromField(temples, 'Main Deity');
  const templeDynasties = uniqueFromField(temples, 'Ruling Dynasty');
  // Locations
  const templeVillages = uniqueFromField(temples, 'Village');
  const templeDistricts = uniqueFromField(temples, 'District');
  const templeTaluks = uniqueFromField(temples, 'Taluk');

  // Always include base types/subtypes/locations
  window.TYPE_KEYWORDS = Array.from(new Set([
    ...templeTypes, ...herostoneTypes, ...inscriptionTypes,
    'temple', 'temples', 'herostone', 'herostones', 'inscription', 'inscriptions', 'church', 'mosque'
  ].map(normalize)));
  window.SUBTYPE_KEYWORDS = Array.from(new Set([
    ...templeDeities, ...templeDynasties,
    'vishnu', 'shiva', 'sati', 'hero', 'jain', 'buddha'
  ].map(normalize)));
  window.LOCATION_KEYWORDS = Array.from(new Set([
    ...templeVillages, ...templeDistricts, ...templeTaluks,
    'cubbon park', 'lalbagh', 'bengaluru', 'bangalore', 'malleshwaram'
  ].map(normalize)));

  window.typeFuse = new Fuse(window.TYPE_KEYWORDS, { threshold: 0.7 });
  window.subtypeFuse = new Fuse(window.SUBTYPE_KEYWORDS, { threshold: 0.7 });
  window.locationFuse = new Fuse(window.LOCATION_KEYWORDS, { threshold: 0.7 });

  // Debug
  console.log('[AI-Intent] Updated TYPE_KEYWORDS:', window.TYPE_KEYWORDS);
  console.log('[AI-Intent] Updated SUBTYPE_KEYWORDS:', window.SUBTYPE_KEYWORDS);
  console.log('[AI-Intent] Updated LOCATION_KEYWORDS:', window.LOCATION_KEYWORDS);
};

// To use: call window.updateIntentKeywordLists({ temples, herostones, inscriptions }) after your data loads.
// Make sure extractIntentEntities uses window.typeFuse, window.subtypeFuse, window.locationFuse.
