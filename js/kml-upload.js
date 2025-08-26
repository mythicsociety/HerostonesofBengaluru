// Leaflet KML upload and display utility - Cleaned & Compressed
// Adds a styled KML upload button below the toggle switch in the filter panel.
// Uses leaflet-omnivore for KML parsing. Requires leaflet-omnivore.js in your HTML.
(function() {
    function addKMLUploadControl() {
        var map = window.map, menu = document.getElementById('menu');
        if (!map || !menu) return;
        // Remove previous KML upload UI
        var old = menu.querySelector('.kml-upload-wrap');
        if (old) old.remove();
        // File input (hidden)
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.kml';
        fileInput.style.display = 'none';
        // Upload button
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.title = 'Upload KML file';
        btn.className = 'gcd-gl-btn fa fa-upload kml-upload-btn';
        Object.assign(btn.style, {
            width: '28px', height: '28px', fontSize: '1.1em', marginLeft: '4px',
            background: 'none', border: '1px solid #ccc', borderRadius: '4px', color: 'maroon',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        btn.onclick = function() { fileInput.click(); };
        // Label
        var label = document.createElement('span');
        label.textContent = 'Upload KML file:';
        Object.assign(label.style, {
            fontWeight: 'bold', color: 'maroon', letterSpacing: '0.2px',
            display: 'flex', alignItems: 'center'
        });
        // Wrapper
        var kmlWrap = document.createElement('div');
        kmlWrap.className = 'kml-upload-wrap';
        Object.assign(kmlWrap.style, {
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: "'Segoe UI', 'Arial', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '1em', margin: '0 0 10px 0', padding: '0 12px'
        });
        kmlWrap.append(label, btn, fileInput);
        // Divider above slider bar section title
        var periodLabel = menu.querySelector('.period-century-label');
        if (periodLabel && !menu.querySelector('.slider-section-divider')) {
            var divider = document.createElement('div');
            Object.assign(divider.style, {
                width: '100%', height: '1px', background: '#e0e0e0', margin: '20px 0 0 0'
            });
            divider.className = 'slider-section-divider';
            menu.insertBefore(divider, periodLabel);
        }
        // Insert below toggle switch
        var toggleSwitch = menu.querySelector('.switch-toggle-wrap');
        if (toggleSwitch && toggleSwitch.nextSibling) {
            menu.insertBefore(kmlWrap, toggleSwitch.nextSibling);
        } else {
            menu.appendChild(kmlWrap);
        }
        // KML layer reference
        var kmlLayer = null;
        fileInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(event) {
                if (kmlLayer) map.removeLayer(kmlLayer);
                if (map.getPane('pane_KMLUpload')) map.removeLayer(map.getPane('pane_KMLUpload'));
                kmlLayer = omnivore.kml.parse(event.target.result);
                kmlLayer.options.pane = 'pane_KMLUpload';
                if (!map.getPane('pane_KMLUpload')) {
                    map.createPane('pane_KMLUpload');
                    map.getPane('pane_KMLUpload').style.zIndex = 350;
                }
                kmlLayer.addTo(map);
                // Dispatch custom event for boundary filter integration
                var event = new CustomEvent('kml-upload-success', { detail: { layer: kmlLayer } });
                document.dispatchEvent(event);
            };
            reader.readAsText(file);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addKMLUploadControl);
    } else {
        addKMLUploadControl();
    }
})();
