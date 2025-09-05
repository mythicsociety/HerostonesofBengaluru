import { COLOR_OPTIONS, getMarkerSVG } from './markerUtils.js';

export function createDivIcon(shape, markerSize, markerColorIdx, markerOpacity) {
  const size = markerSize || 18;
  const color = COLOR_OPTIONS[markerColorIdx]?.solid || COLOR_OPTIONS[0].solid;
  return L.divIcon({
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: getMarkerSVG(shape, size, color, markerOpacity)
  });
}

export function createClusterIcon(count, markerColorIdx) {
  const size = count < 10 ? 36 : count < 100 ? 48 : 60;
  const color = COLOR_OPTIONS[markerColorIdx]?.gradient || COLOR_OPTIONS[0].gradient;
  return L.divIcon({
    html: `<div style="background:${color};border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:1.1em;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.10);opacity:0.95;">${count}</div>`,
    className: 'herostone-cluster-icon',
    iconSize: [size, size]
  });
}

export function getLatLng(item) {
  let lat = item.Lat ?? item.lat ?? item.latitude ?? item.Latitude;
  let lng = item.Long ?? item.Lng ?? item.lng ?? item.lon ?? item.Lon ?? item.longitude ?? item.Longitude;
  if (typeof lat === 'string') lat = parseFloat(lat);
  if (typeof lng === 'string') lng = parseFloat(lng);
  return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] : null;
}

export function getTooltip(item) {
  let tooltip = '';
  if (item["Type of Herostone"]) tooltip += `<b>${item["Type of Herostone"]}</b><br/>`;
  if (item["Period"]) tooltip += `Period: ${item["Period"]}<br/>`;
  if (item["Village"]) tooltip += `Village: ${item["Village"]}<br/>`;
  if (item["Script of the Inscription"]) {
    tooltip += `Script: ${item["Script of the Inscription"]}`;
  } else if (item["script"]) {
    tooltip += `Script: ${item["script"]}`;
  }
  return tooltip;
}
