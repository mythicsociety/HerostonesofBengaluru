function showModalTab(tab) {
  var modalTabContent = document.getElementById('modalTabContent');
  if(tab === 'about') {
    if(selectedFeature && selectedFeature.properties) {
      let props = selectedFeature.properties;
      let tableRows = Object.keys(props).map(key => `<tr><td style='font-weight:bold;'>${key}</td><td>${props[key]}</td></tr>`).join('');
      modalTabContent.innerHTML = `
        <div class='mt-3'>
          <table class='table table-bordered table-sm'>
            <thead><tr><th>Attribute</th><th>Value</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      `;
    } else {
      modalTabContent.innerHTML = `<div class='text-center mt-3'><strong>Bengaluru Heritage Map</strong><br>Explore heritage sites, features, and more.</div>`;
    }
  }
  if(tab === 'features') {
    // Gather visible markers for each type
    function getVisibleMarkers(layer, cluster, type) {
      var arr = [];
      if (window.map && layer && window.map.hasLayer(layer)) {
        layer.eachLayer(function(l) {
          if (l.feature && l._map) arr.push({layer: l, feature: l.feature, type});
        /**
         * infoModal.js
         * Info modal tab logic for WebGIS
         * All logic preserved, only code style and comments improved.
         */
        });
      }
      if (window.map && cluster && window.map.hasLayer(cluster) && cluster.getVisibleParentMarkers) {
        cluster.getVisibleParentMarkers().forEach(function(l) {
          if (l.feature) arr.push({layer: l, feature: l.feature, type});
        });
      }
      return arr;
    }

    var herostones = getVisibleMarkers(window.herostonesLayer, window.herostonesCluster, 'Herostone');
    var inscriptions = getVisibleMarkers(window.inscriptionsLayer, window.inscriptionsCluster, 'Inscription');
    var temples = getVisibleMarkers(window.templesLayer, window.templesCluster, 'Temple');

    if (herostones.length === 0 && inscriptions.length === 0 && temples.length === 0) {
      modalTabContent.innerHTML = `<div class='text-center mt-3'><strong>No visible features</strong></div>`;
      return;
    }

    function buildDropdown(arr, id, label) {
      if (arr.length === 0) return '';
      var widthStyle = 'width:100%';
      var html = `<select id='${id}' class='form-select mb-3 feature-dropdown' style='${widthStyle}'>`;
      html += `<option value=''>Select ${label}...</option>`;
      arr.forEach(function(obj, idx) {
        var name = obj.feature.properties.name || obj.feature.properties.Name || obj.feature.properties.title || 'Unnamed';
        html += `<option value='${idx}'>${name}</option>`;
      });
      html += `</select>`;
      return html;
    }

    var dropdownHtml = `<div style='display:flex;flex-direction:column;gap:8px;width:100%;'>`;
    dropdownHtml += buildDropdown(herostones, 'dropdownHerostones', 'Herostone');
    dropdownHtml += buildDropdown(inscriptions, 'dropdownInscriptions', 'Inscription');
    dropdownHtml += buildDropdown(temples, 'dropdownTemples', 'Temple');
    dropdownHtml += `</div>`;
    modalTabContent.innerHTML = dropdownHtml;

    function highlightMarker(obj) {
      var latlng = obj.layer.getLatLng ? obj.layer.getLatLng() : (obj.layer._latlng || null);
      if (!latlng) return;
      window.map.setView(latlng, Math.max(window.map.getZoom(), 15), {animate:true});
      if (window._highlightCircle) {
        window.map.removeLayer(window._highlightCircle);
        window._highlightCircle = null;
      }
      window._highlightCircle = L.circle(latlng, {
        radius: 100,
        color: '#FFD700',
        weight: 4,
        fillOpacity: 0.2
      }).addTo(window.map);
      var blinkCount = 0;
      var blinkInterval = setInterval(function() {
        if (!window._highlightCircle) return clearInterval(blinkInterval);
        window._highlightCircle.setStyle({color: blinkCount % 2 === 0 ? '#FFD700' : '#FF0000'});
        blinkCount++;
        if (blinkCount > 5) {
          window._highlightCircle.setStyle({color: '#FFD700'});
          clearInterval(blinkInterval);
        }
      }, 300);
    }

    var ddHerostones = document.getElementById('dropdownHerostones');
    if (ddHerostones) ddHerostones.onchange = function(e) {
      var idx = e.target.value;
      if (idx === '') return;
      highlightMarker(herostones[idx]);
    };
    var ddInscriptions = document.getElementById('dropdownInscriptions');
    if (ddInscriptions) ddInscriptions.onchange = function(e) {
      var idx = e.target.value;
      if (idx === '') return;
      highlightMarker(inscriptions[idx]);
    };
    var ddTemples = document.getElementById('dropdownTemples');
    if (ddTemples) ddTemples.onchange = function(e) {
      var idx = e.target.value;
      if (idx === '') return;
      highlightMarker(temples[idx]);
    };
  }
  if(tab === 'wiki') {
    modalTabContent.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... Wikipedia</strong></div>`;
  }
  if(tab === 'photos') {
    modalTabContent.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... Photos</strong></div>`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var infoBtn = document.getElementById('infoBtn');
  var infoModalEl = document.getElementById('infoModal');
  if (infoBtn && infoModalEl) {
    var modalInstance = null;
    infoBtn.addEventListener('click', function() {
      modalInstance = bootstrap.Modal.getOrCreateInstance(infoModalEl);
      if (infoModalEl.classList.contains('show')) {
        modalInstance.hide();
      } else {
        showInfoModal();
      }
    });
  }
});

var modalTabs = document.querySelectorAll('#modalTabs .nav-link');
modalTabs.forEach(tab => {
  tab.onclick = function() {
    modalTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showModalTab(tab.dataset.tab);
  };
});
// Info Modal logic for tabs and content
// Requires Bootstrap 5

// Make modal draggable by drag handle
document.addEventListener('DOMContentLoaded', function() {
  var dragHandle = document.getElementById('modalDragHandle');
  var modalDialog = document.querySelector('#infoModal .modal-dialog');
  if (modalDialog) {
    modalDialog.style.position = 'fixed';
    modalDialog.style.top = '75px'; // 60px navbar + 15px space
    modalDialog.style.right = '20px';
    modalDialog.style.left = 'auto';
    modalDialog.style.margin = '0';
    modalDialog.style.zIndex = 2000;
  }
  var isDragging = false, startX = 0, startY = 0, origX = 0, origY = 0;
  if (dragHandle && modalDialog) {
    dragHandle.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      var rect = modalDialog.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
  modalDialog.style.position = 'fixed';
  modalDialog.style.left = (origX + dx) + 'px';
  modalDialog.style.top = (origY + dy) + 'px';
  modalDialog.style.zIndex = 2000;
    });
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
      }
    });
  }
});

var selectedFeature = null;

function showInfoModal(feature) {
  selectedFeature = feature || null;
  var modal = new bootstrap.Modal(document.getElementById('infoModal'), { backdrop: false });
  showModalTab('about');
  modal.show();
}


function removeAllModalBackdrops() {
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  console.log('[InfoModal] All modal backdrops removed.');
}

var infoModalEl = document.getElementById('infoModal');
if (infoModalEl) {
  infoModalEl.addEventListener('shown.bs.modal', removeAllModalBackdrops);
  infoModalEl.addEventListener('hide.bs.modal', removeAllModalBackdrops);
  infoModalEl.addEventListener('hide.bs.modal', function(event) {
    // Properly move focus before modal hides to avoid aria-hidden error
    // First check if focus is inside modal
    if (document.activeElement && infoModalEl.contains(document.activeElement)) {
      // Blur the active element first
      document.activeElement.blur();
      // Move focus to a suitable element outside the modal
      var queryBtn = document.getElementById('queryBtn');
      if (queryBtn) {
        setTimeout(function() { queryBtn.focus(); }, 10);
      } else {
        setTimeout(function() { document.body.focus(); }, 10);
      }
    }
  });
  infoModalEl.addEventListener('hidden.bs.modal', function() {
    infoModalEl.removeAttribute('aria-hidden');
  });
}

// Example: Call showInfoModal(feature) from map.js when a marker/point is clicked
// showInfoModal({ name: 'Someshwara Temple', type: 'Temple' });
