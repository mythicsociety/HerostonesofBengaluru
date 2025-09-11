// SidePanel.js - Implements Leaflet.SidePanel for left sidebar with tabs
// Make sure to include Leaflet.SidePanel plugin in your index.html
// Example CDN:
// <link rel="stylesheet" href="https://unpkg.com/leaflet-sidepanel/dist/leaflet-sidepanel.min.css"/>
// <script src="https://unpkg.com/leaflet-sidepanel/dist/leaflet-sidepanel.min.js"></script>

// Initialize SidePanel after map is created
window.initSidePanel = function(map) {
  // Create the left side panel control
  var sidePanel = L.control.sidepanel('sidepanel', {
    tabs: [
      { id: 'layers', title: 'Layers', icon: 'fa-layer-group' },
      { id: 'filters', title: 'Filters', icon: 'fa-filter' }
    ],
    position: 'left'
  }).addTo(map);

  // Set content for each tab
  sidePanel.setContent('layers', `
    <h4>Layers</h4>
    <div id="sidepanel-layers">
      <!-- Layer controls will be injected here -->
    </div>
  `);
  sidePanel.setContent('filters', `
    <h4>Filters</h4>
    <div id="sidepanel-filters">
      <!-- Filter controls will be injected here -->
    </div>
  `);

  // Example: Open Layers tab by default
  sidePanel.openTab('layers');
  window.sidePanel = sidePanel;

  // Create the right info panel
  var infoPanel = L.control.sidepanel('infopanel', {
    tabs: [
      { id: 'about', title: 'About', icon: 'fa-info-circle' },
      { id: 'features', title: 'Features', icon: 'fa-list' },
      { id: 'wiki', title: 'Wikipedia', icon: 'fa-wikipedia-w' },
      { id: 'photos', title: 'Photos', icon: 'fa-image' }
    ],
    position: 'right'
  }).addTo(map);

  // Migrate modal content to info panel tabs
  infoPanel.setContent('about', `<h4>About</h4><div>Bengaluru Heritage Map<br>About content here.</div>`);
  infoPanel.setContent('features', `
    <h4>Features</h4>
    <div id="features-dropdowns">
      <!-- Dropdowns will be injected here -->
    </div>
    <style>
      @keyframes marker-blink {
        0%, 100% { filter: none; }
        50% { filter: brightness(2) drop-shadow(0 0 8px yellow); }
      }
      .marker-blink {
        animation: marker-blink 0.5s linear infinite;
      }
    </style>
    <script>
      // This script will be replaced by JS logic in map.js
    </script>
  `);
  infoPanel.setContent('wiki', `<h4>Wikipedia</h4><div>Wikipedia content here.</div>`);
  infoPanel.setContent('photos', `<h4>Photos</h4><div>Photos content here.</div>`);

  window.infoPanel = infoPanel;
  // Optionally, open About tab by default
  // infoPanel.openTab('about');

  // Add toggle logic for right panel
  document.addEventListener('DOMContentLoaded', function() {
    // Toggle button for right panel
    var panel = document.getElementById('panelRight');
    var toggleBtn = document.getElementById('panelRightToggle');
    var arrow = document.getElementById('panelRightArrow');
    if (toggleBtn && panel) {
      toggleBtn.onclick = function() {
        if (panel.style.right === '0px' || panel.style.right === '') {
          panel.style.right = '-320px';
          arrow.style.transform = 'rotate(180deg)';
        } else {
          panel.style.right = '0px';
          arrow.style.transform = 'rotate(0deg)';
        }
      };
    }
    // Info button opens About tab and shows panel
    var infoBtn = document.getElementById('infoBtn');
    if (infoBtn) {
      infoBtn.onclick = function() {
        panel.setAttribute('aria-hidden', 'false');
        var tabContents = document.querySelectorAll('#panelRight .sidepanel-tab-content');
        tabContents.forEach(function(content) {
          content.style.display = content.getAttribute('data-tab-content') === 'tab-1' ? '' : 'none';
        });
      };
    }
  });
};

// Usage: Call window.initSidePanel(map) after your Leaflet map is initialized.
// Then inject your layer/filter controls into #sidepanel-layers and #sidepanel-filters.
