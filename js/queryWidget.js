// Track query widget open/close state
window.isQueryWidgetOpen = false;
// Toggle query widget open/close
document.addEventListener('DOMContentLoaded', function() {
  var queryBtn = document.getElementById('queryBtn');
  var querySection = document.getElementById('query-section');
  if (queryBtn && querySection) {
    queryBtn.addEventListener('click', function() {
      if (!window.isQueryWidgetOpen) {
        showQueryWidget();
      } else {
        closeQueryWidget();
      }
    });
  }
});

function closeQueryWidget() {
  var querySection = document.getElementById('query-section');
  if (querySection) {
    querySection.style.display = 'none';
    window.isQueryWidgetOpen = false;
    var mapDiv = document.getElementById('map');
    if (mapDiv) {
      mapDiv.style.height = 'calc(100vh - 56px)';
      mapDiv.style.top = '0';
    }
  }
}
// Query Widget UI and logic for GeoJSON layers

function showQueryWidget() {
  let querySection = document.getElementById('query-section');
  if (querySection) {
    querySection.style.display = 'flex';
    querySection.style.flexDirection = 'column';
    querySection.style.height = '30vh';
    querySection.style.background = '#fff';
    querySection.style.boxShadow = '0 -2px 12px rgba(0,0,0,0.08)';
    querySection.style.width = '100%';
    querySection.style.zIndex = '100';
    window.isQueryWidgetOpen = true;
    // Set the HTML content
    querySection.innerHTML = `
      <div id="query-section-resize-handle"><span class="grip-icon"> 
        <svg width="32" height="10" viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="5" r="2" fill="#888"/>
          <circle cx="12" cy="5" r="2" fill="#888"/>
          <circle cx="20" cy="5" r="2" fill="#888"/>
          <circle cx="28" cy="5" r="2" fill="#888"/>
        </svg>
      </span></div>
      <div id="queryHeaderBar" style="width:100%; min-height:44px; display:flex; align-items:center; justify-content:space-between; background:#f5f5f7; border-bottom:1px solid #eee; padding:0 18px;">
        <div style="font-size:1.1rem; font-weight:600; letter-spacing:0.5px;">Query Features</div>
        <div id="queryHeaderControls" style="display:flex; align-items:center; gap:18px;"></div>
        <div>
          <span id="queryMinimizeBtn" style="cursor:pointer; font-size:1.3rem; margin-right:18px;" title="Minimize"><i class="fa fa-chevron-down"></i></span>
          <span id="queryCloseBtn" style="cursor:pointer; font-size:1.3rem;" title="Close"><i class="fa fa-times"></i></span>
        </div>
      </div>
      <div id="queryResizable" style="width:100%; height:calc(100% - 44px); display:flex; flex-direction:row;">
        <div id="queryControls" style="width:20%; min-width:200px; max-width:350px; padding:24px; border-right:1px solid #eee; background:#fafbfc; overflow-y:auto; height:100%;">
          <form id="queryForm">
            <div class="mb-3">
              <label for="queryLayer" class="form-label">Layer</label>
              <select class="form-select" id="queryLayer">
                <option value="" selected disabled>Select Layer...</option>
                <option value="Herostones">Herostones</option>
                <option value="Inscriptions">Inscriptions</option>
                <option value="Temples">Temples</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="queryField" class="form-label">Attribute</label>
              <select class="form-select" id="queryField">
                <option value="" selected disabled>Select Attribute...</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="queryOperator" class="form-label">Operator</label>
              <select class="form-select" id="queryOperator">
                <option value="" selected disabled>Select Operator...</option>
                <option value="=">=</option>
                <option value="contains">contains</option>
                <option value="startsWith">starts with</option>
                <option value="endsWith">ends with</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="queryValue" class="form-label">Value</label>
              <input type="text" class="form-control" id="queryValue">
            </div>
            <button type="submit" class="btn btn-primary">Run Query</button>
          </form>
        </div>
        <div id="queryResults" style="width:80%; padding:24px; overflow:auto; height:100%; display:flex; flex-direction:column;"></div>
      </div>
    `;

    // Add resize handle logic
    var resizeHandle = document.getElementById('query-section-resize-handle');
    if (resizeHandle) {
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.top = '0';
      resizeHandle.style.left = '0';
      resizeHandle.style.width = '100%';
      resizeHandle.style.height = '8px';
      resizeHandle.style.cursor = 'ns-resize';
      resizeHandle.style.zIndex = '101';
      resizeHandle.style.background = 'rgba(0,0,0,0.18)';
      let isResizing = false;
      let startY = 0;
      let startHeight = 0;
      resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        startY = e.clientY;
        startHeight = querySection.offsetHeight;
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        let dy = startY - e.clientY;
        let newHeight = startHeight + dy;
        if (newHeight < 44) newHeight = 44;
        if (newHeight > window.innerHeight - 100) newHeight = window.innerHeight - 100;
        querySection.style.height = newHeight + 'px';
        var mapDiv = document.getElementById('map');
        if (mapDiv) {
          mapDiv.style.height = (window.innerHeight - newHeight - 56) + 'px';
        }
      });
      document.addEventListener('mouseup', function() {
        if (isResizing) {
          isResizing = false;
          document.body.style.userSelect = '';
        }
      });
    }
  }
  // Add font-awesome for icons if not present
  if (!document.getElementById('fa-icons')) {
    var fa = document.createElement('link');
    fa.id = 'fa-icons';
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fa);
  }
  // Header bar actions
  document.getElementById('queryCloseBtn').onclick = function() {
    closeQueryWidget();
  };
  document.getElementById('queryMinimizeBtn').onclick = function() {
    var resizable = document.getElementById('queryResizable');
    if (resizable.style.display !== 'none') {
      resizable.style.display = 'none';
      querySection.style.height = '44px';
    } else {
      resizable.style.display = 'flex';
      querySection.style.height = '30vh';
    }
    var mapDiv = document.getElementById('map');
    if (mapDiv) {
      // Account for navbar height (56px) + query section height when minimized
      mapDiv.style.height = (resizable.style.display === 'none' ? 'calc(100vh - 56px - 44px)' : 'calc(100vh - 56px - 30vh)');
      mapDiv.style.top = '0';
    }
  };
  // When shown, resize map accounting for navbar height
  querySection.style.display = 'flex';
  var mapDiv = document.getElementById('map');
  if (mapDiv) {
    // Account for navbar height (56px)
    mapDiv.style.height = 'calc(100vh - 56px - 30vh)';
    mapDiv.style.top = '0';
  }

  // Enable move for Query Features modal
  var moveHandle = document.getElementById('queryModalMoveHandle');
  var modalDialog = document.querySelector('#queryWidgetModal .modal-dialog');
  var isMoving = false, startX = 0, startY = 0, origX = 0, origY = 0;
  if (moveHandle && modalDialog) {
    moveHandle.addEventListener('mousedown', function(e) {
      isMoving = true;
      startX = e.clientX;
      startY = e.clientY;
      var rect = modalDialog.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      document.body.style.userSelect = 'none';
      // Do NOT change width/height here
    });
    document.addEventListener('mousemove', function(e) {
      if (!isMoving) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      modalDialog.style.position = 'fixed';
      modalDialog.style.left = (origX + dx) + 'px';
      modalDialog.style.top = (origY + dy) + 'px';
      modalDialog.style.zIndex = 2000;
    });
    document.addEventListener('mouseup', function() {
      if (isMoving) {
        isMoving = false;
        document.body.style.userSelect = '';
      }
    });
  }

  // Populate fields for selected layer
  function updateFields() {
    var layerName = document.getElementById('queryLayer').value;
    var fieldSelect = document.getElementById('queryField');
  fieldSelect.innerHTML = '';
  var defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Select Attribute...';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  fieldSelect.appendChild(defaultOpt);
    var sampleFeature = null;
    var layerLoaded = false;
    
    // Access layers through window object
    if (layerName === 'Herostones' && window.herostonesLayer) {
      var features = window.herostonesLayer.toGeoJSON().features;
      layerLoaded = features.length > 0;
      if (layerLoaded) sampleFeature = features[0];
    } else if (layerName === 'Inscriptions' && window.inscriptionsLayer) {
      var features = window.inscriptionsLayer.toGeoJSON().features;
      layerLoaded = features.length > 0;
      if (layerLoaded) sampleFeature = features[0];
    } else if (layerName === 'Temples' && window.templesLayer) {
      var features = window.templesLayer.toGeoJSON().features;
      layerLoaded = features.length > 0;
      if (layerLoaded) sampleFeature = features[0];
    }
    var msgDiv = document.getElementById('queryLayerMsg');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.id = 'queryLayerMsg';
      msgDiv.className = 'mb-2';
      fieldSelect.parentNode.insertBefore(msgDiv, fieldSelect);
    }
    if (!layerLoaded) {
      msgDiv.innerHTML = `<div class='alert alert-warning p-2'>Layer not loaded. <button id='loadLayerBtn' class='btn btn-sm btn-primary'>Load ${layerName}</button></div>`;
      fieldSelect.innerHTML = '';
      document.getElementById('loadLayerBtn').onclick = function() {
        if (typeof window.loadLayerGeoJSON === 'function') window.loadLayerGeoJSON(layerName);
        setTimeout(updateFields, 800);
        // Open Layer dropdown as a true dropdown (not scrollable)
        var layerSelect = document.getElementById('queryLayer');
        if (layerSelect) {
          layerSelect.focus();
          // Try to trigger dropdown open (works in most browsers)
          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('mousedown', true, true, window);
          layerSelect.dispatchEvent(event);
        }
      };
    } else {
      msgDiv.innerHTML = '';
      var keys = Object.keys(sampleFeature.properties);
      if (keys.length === 0) {
        var opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No attributes found';
        fieldSelect.appendChild(opt);
      } else {
        keys.forEach(function(key) {
          var opt = document.createElement('option');
          opt.value = key;
          opt.textContent = key;
          fieldSelect.appendChild(opt);
        });
      }
    }
  }
  document.getElementById('queryLayer').addEventListener('change', updateFields);
  updateFields();

  // Query logic
  document.getElementById('queryForm').onsubmit = function(e) {
    e.preventDefault();
    var layerName = document.getElementById('queryLayer').value;
    var field = document.getElementById('queryField').value;
    var operator = document.getElementById('queryOperator').value;
    var value = document.getElementById('queryValue').value;
    var results = [];
    var layer = null;
    
    // Access layers through window object
    if (layerName === 'Herostones') layer = window.herostonesLayer;
    if (layerName === 'Inscriptions') layer = window.inscriptionsLayer;
    if (layerName === 'Temples') layer = window.templesLayer;
    if (!layer) return;
    var features = layer.toGeoJSON().features;
    results = features.filter(function(f) {
      var prop = f.properties[field];
      if (operator === '=') return prop == value;
      if (operator === 'contains') return (prop + '').toLowerCase().includes(value.toLowerCase());
      if (operator === 'startsWith') return (prop + '').toLowerCase().startsWith(value.toLowerCase());
      if (operator === 'endsWith') return (prop + '').toLowerCase().endsWith(value.toLowerCase());
      if (operator === '>') return parseFloat(prop) > parseFloat(value);
      if (operator === '<') return parseFloat(prop) < parseFloat(value);
      return false;
    });
    // Pagination variables
    var resultsDiv = document.getElementById('queryResults');
    var pageSize = 5;
    var currentPage = 1;

    function renderTable(page) {
      var headerControls = document.getElementById('queryHeaderControls');
      if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">No matching features found.</div>';
        if (headerControls) headerControls.innerHTML = '';
        return;
      }
      var start = (page - 1) * pageSize;
      var end = Math.min(start + pageSize, results.length);
      var html = '<div style="flex:1 1 0; height:100%; overflow:auto; max-width:100%; display:flex; flex-direction:column; justify-content:stretch;">';
      html += '<table class="table table-bordered table-sm" style="min-width:600px;width:100%;height:100%;">';
      html += '<thead style="position:sticky;top:0;background:#f5f5f7;z-index:2;"><tr>';
      Object.keys(results[0].properties).forEach(function(k) { html += '<th>' + k + '</th>'; });
      html += '</tr></thead><tbody>';
      for (var i = start; i < end; i++) {
        var f = results[i];
        html += '<tr>';
        Object.keys(f.properties).forEach(function(k) {
          var cellValue = f.properties[k];
          var highlight = '';
          var innerHtml = cellValue;
          // Highlight if this is the queried field and matches the value
          if (k === field) {
            let matched = false;
            if (operator === '=') {
              if (cellValue == value) {
                highlight = 'background:yellow;font-weight:bold;';
                innerHtml = `<span style='background:lightgreen;'>${cellValue}</span>`;
                matched = true;
              }
            }
            if (operator === 'contains') {
              let idx = (cellValue + '').toLowerCase().indexOf(value.toLowerCase());
              if (idx !== -1) {
                highlight = 'background:yellow;font-weight:bold;';
                let valStr = cellValue + '';
                let before = valStr.substring(0, idx);
                let match = valStr.substring(idx, idx + value.length);
                let after = valStr.substring(idx + value.length);
                innerHtml = `${before}<span style='background:lightgreen;'>${match}</span>${after}`;
                matched = true;
              }
            }
            if (operator === 'startsWith') {
              let valStr = cellValue + '';
              if (valStr.toLowerCase().startsWith(value.toLowerCase())) {
                highlight = 'background:yellow;font-weight:bold;';
                let match = valStr.substring(0, value.length);
                let after = valStr.substring(value.length);
                innerHtml = `<span style='background:lightgreen;'>${match}</span>${after}`;
                matched = true;
              }
            }
            if (operator === 'endsWith') {
              let valStr = cellValue + '';
              if (valStr.toLowerCase().endsWith(value.toLowerCase())) {
                highlight = 'background:yellow;font-weight:bold;';
                let before = valStr.substring(0, valStr.length - value.length);
                let match = valStr.substring(valStr.length - value.length);
                innerHtml = `${before}<span style='background:lightgreen;'>${match}</span>`;
                matched = true;
              }
            }
            if (operator === '>' && parseFloat(cellValue) > parseFloat(value)) {
              highlight = 'background:yellow;font-weight:bold;';
              innerHtml = `<span style='background:lightgreen;'>${cellValue}</span>`;
              matched = true;
            }
            if (operator === '<' && parseFloat(cellValue) < parseFloat(value)) {
              highlight = 'background:yellow;font-weight:bold;';
              innerHtml = `<span style='background:lightgreen;'>${cellValue}</span>`;
              matched = true;
            }
          }
          html += `<td style='${highlight}'>${innerHtml}</td>`;
        });
        html += '</tr>';
      }
      html += '</tbody></table></div>';
      resultsDiv.innerHTML = html;
      // Results count and pagination controls in header
      if (headerControls) {
        var headerHtml = '';
        var shownStart = start + 1;
        var shownEnd = end;
        headerHtml += '<div style="font-weight:bold;">Results ' + shownStart + '-' + shownEnd + ' of ' + results.length + '</div>';
        headerHtml += '<div>';
        headerHtml += '<button id="prevPageBtn" class="btn btn-sm btn-secondary"' + (page === 1 ? ' disabled' : '') + '>Prev</button> ';
        headerHtml += '<span> Page ' + page + ' of ' + Math.ceil(results.length / pageSize) + ' </span>';
        headerHtml += '<button id="nextPageBtn" class="btn btn-sm btn-secondary"' + (end >= results.length ? ' disabled' : '') + '>Next</button>';
        headerHtml += '</div>';
        headerControls.innerHTML = headerHtml;
        // Add event listeners for pagination
        document.getElementById('prevPageBtn').onclick = function() {
          if (currentPage > 1) {
            currentPage--;
            renderTable(currentPage);
          }
        };
        document.getElementById('nextPageBtn').onclick = function() {
          if (end < results.length) {
            currentPage++;
            renderTable(currentPage);
          }
        };
      }
    }
    renderTable(currentPage);

    // Highlight results on map
    if (window._queryHighlightLayer) {
      window.map.removeLayer(window._queryHighlightLayer);
    }
    window._queryHighlightLayer = L.geoJSON(results, {
      style: { color: '#e63946', weight: 4, fillOpacity: 0.2 },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, { radius: 8, color: '#e63946', fillOpacity: 0.5 });
      }
    }).addTo(window.map);
    window.map.fitBounds(window._queryHighlightLayer.getBounds(), {padding: [40,40], maxZoom: 15});
  };
}

// ...existing code...

// Add draggable resize handle to query-section
window.addEventListener('DOMContentLoaded', function() {
  var querySection = document.getElementById('query-section');
  if (querySection && !document.getElementById('query-section-resize-handle')) {
    var resizeHandle = document.createElement('div');
    resizeHandle.id = 'query-section-resize-handle';
    querySection.appendChild(resizeHandle);
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.top = '0';
      resizeHandle.style.left = '0';
      resizeHandle.style.width = '100%';
      resizeHandle.style.height = '8px';
      resizeHandle.style.cursor = 'ns-resize';
      resizeHandle.style.zIndex = '101';
      resizeHandle.style.background = 'rgba(0,0,0,0.08)';
      // Add visual indicator for resize handle
      resizeHandle.innerHTML = `<div style="width:50px;height:4px;background:#888;border-radius:2px;margin:2px auto;"></div>`;    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    resizeHandle.addEventListener('mousedown', function(e) {
      isResizing = true;
      startY = e.clientY;
      startHeight = querySection.offsetHeight;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
      if (!isResizing) return;
      let dy = startY - e.clientY;
      let newHeight = startHeight + dy;
      if (newHeight < 44) newHeight = 44;
      if (newHeight > window.innerHeight - 100) newHeight = window.innerHeight - 100;
      querySection.style.height = newHeight + 'px';
      var mapDiv = document.getElementById('map');
      if (mapDiv) {
        mapDiv.style.height = (window.innerHeight - newHeight - 56) + 'px';
      }
    });
    document.addEventListener('mouseup', function() {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = '';
      }
    });
  }
});

