// Utility for robust coordinate parsing
function safeCoords(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return null;
  const latNum = typeof lat === 'string' ? parseFloat(lat.trim()) : Number(lat);
  const lngNum = typeof lng === 'string' ? parseFloat(lng.trim()) : Number(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return null;
  if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) return null;
  return [latNum, lngNum];
}
// Make available globally for in-browser Babel
window.safeCoords = safeCoords;
