// Marker/cluster color options and SVG helper
export const COLOR_OPTIONS = [
  { name: 'Violet', gradient: 'linear-gradient(135deg,#a259c4 0%,#7b2ff2 100%)', solid: '#a259c4' },
  { name: 'Blue', gradient: 'linear-gradient(135deg,#2196f3 0%,#21cbf3 100%)', solid: '#2196f3' },
  { name: 'Green', gradient: 'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)', solid: '#43e97b' },
  { name: 'Orange', gradient: 'linear-gradient(135deg,#ff9966 0%,#ff5e62 100%)', solid: '#ff9966' },
  { name: 'Red', gradient: 'linear-gradient(135deg,#f85032 0%,#e73827 100%)', solid: '#f85032' }
];

export function getMarkerSVG(shape, size, color, opacity) {
  switch (shape) {
    case 'triangle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><polygon points="9,3 16,15 2,15" fill="${color}" fill-opacity="${opacity}"/></svg>`;
    case 'square':
      return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><rect x="3" y="3" width="12" height="12" fill="${color}" fill-opacity="${opacity}"/></svg>`;
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="${color}" fill-opacity="${opacity}"/></svg>`;
  }
}
