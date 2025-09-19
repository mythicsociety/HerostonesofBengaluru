// Track query widget open/close state
window.isQueryWidgetOpen = false;
// Toggle query widget open/close
document.addEventListener('DOMContentLoaded', function() {
// Listen for navbar full-text search event
document.addEventListener('navbarFullTextSearch', function(e) {
  var query = (e.detail && e.detail.query) ? e.detail.query.trim().toLowerCase() : '';
  // Store last search term globally for About panel highlighting
  window._lastSearchTerm = query;
  if (!query) return;
  // Collect all features from all layers
  var allFeatures = [];
  var layerMap = {
    'Herostones': window.herostonesLayer,
    'Inscriptions': window.inscriptionsLayer,
    'Temples': window.templesLayer
  };
  // Only consider visible layers
  var visibleLayerCount = 0;
  Object.keys(layerMap).forEach(function(layerName) {
    var layer = layerMap[layerName];
    if (layer && window.map.hasLayer(layer)) {
      visibleLayerCount++;
      layer.eachLayer(function(marker) {
        if (marker.feature) {
          marker.feature._queryLayer = layerName;
          allFeatures.push(marker.feature);
        }
      });
    }
  });
  // Filter features by matching any property value (full-text)
  var results = allFeatures.filter(function(f) {
    var props = f.properties || {};
    return Object.values(props).some(function(val) {
      return (val + '').toLowerCase().includes(query);
    });
  });
  // Notification logic
  // Show notification if no layers visible
  if (visibleLayerCount === 0) {
    if (window.showNotification) window.showNotification('No layers are visible on the map. Please enable a layer to search.', 'warning', 3500);
  }
  // Show notification if no matches found
  else if (results.length === 0) {
    if (window.showNotification) window.showNotification('No matching features found for your search.', 'warning', 3500);
  }
  // Highlight matching markers with a red circle
  // First, clear all highlights
  Object.values(layerMap).forEach(function(layer) {
    if (!layer) return;
    layer.eachLayer(function(marker) {
      var icon = marker.options.icon;
      if (icon && icon.options && icon.options.className) {
        icon.options.className = icon.options.className.replace(/ highlighted-marker/g, '');
        marker.setIcon(icon);
      }
    });
  });
  // Then, highlight matched markers
  results.forEach(function(f) {
    var layer = layerMap[f._queryLayer];
    if (!layer) return;
    layer.eachLayer(function(marker) {
      // Match by feature id (Leaflet stores feature in marker.feature)
      if (marker.feature === f) {
        var icon = marker.options.icon;
        if (icon && icon.options && icon.options.className) {
          if (!icon.options.className.includes('highlighted-marker')) {
            icon.options.className += ' highlighted-marker';
            marker.setIcon(icon);
          }
        }
      }
    });
  });
  // Add CSS for highlighted marker
  if (!document.getElementById('highlighted-marker-style')) {
    var style = document.createElement('style');
    style.id = 'highlighted-marker-style';
    style.innerHTML = '.highlighted-marker div { box-shadow: 0 0 0 4px red !important; }';
    document.head.appendChild(style);
  }
});
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
      <div id="queryResizable" style="width:100%; height:calc(100% - 44px); display:flex; flex-direction:row; position:relative;">
        <div id="queryControls" style="width:20%; min-width:325px; max-width:900px; padding:24px; border-right:1px solid #eee; background:#fafbfc; overflow-y:auto; height:100%; position:relative;">
          <div id="queryControlsResizeHandle" style="position:absolute;top:0;right:0;width:8px;height:100%;cursor:ew-resize;z-index:10;background:rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;">
            <div style="width:4px;height:48px;background:#888;border-radius:2px;"></div>
          </div>
          <form id="queryForm">
            <!-- Removed extra Layer dropdown; layer selection is now per condition row -->
            <div style="width:100%;" id="queryConditionHeadings">
              <div class="d-flex w-100" style="gap:8px;">
                <div style="width:16%;"><label style="font-size:0.92em; font-weight:500;">Layer</label></div>
                <div style="width:24%;"><label style="font-size:0.92em; font-weight:500;">Field</label></div>
                <div style="width:18%;"><label style="font-size:0.92em; font-weight:500;">Operator</label></div>
                <div style="width:16%;"><label style="font-size:0.92em; font-weight:500;">Value</label></div>
                <div style="width:10%;min-width:60px;"><label style="font-size:0.92em; font-weight:500;">AND/OR</label></div>
                <div style="width:36px;"></div>
              </div>
            </div>
            <div id="queryConditions">
              <!-- Dynamic conditions will be inserted here -->
            </div>
            <!-- Removed global Combine Conditions dropdown; logic is now per condition row -->
            <div class="d-flex align-items-center gap-2 mb-2">
              <button type="button" class="btn btn-secondary" id="addConditionBtn">Add Condition</button>
              <button type="submit" class="btn btn-primary">Run Query</button>
            </div>
          </form>
        </div>
        <div id="queryResults" style="width:80%; padding:24px; overflow:auto; height:100%; display:flex; flex-direction:column;"></div>
      </div>
    `;

    // Add vertical resize handle logic (top of query-section)
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

    // Add horizontal resize handle logic (right edge of queryControls)
    var controlsResizeHandle = document.getElementById('queryControlsResizeHandle');
    var queryControls = document.getElementById('queryControls');
    if (controlsResizeHandle && queryControls) {
      let isResizing = false;
      let startX = 0;
      let startWidth = 0;
      controlsResizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        startX = e.clientX;
        startWidth = queryControls.offsetWidth;
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        let dx = e.clientX - startX;
        let newWidth = startWidth + dx;
    let minWidth = 325;
    let maxWidth = Math.min(window.innerWidth * 0.5, 900);
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    queryControls.style.width = newWidth + 'px';
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

  // Multi-condition support
  let conditionCount = 0;
  function addConditionRow() {
    conditionCount++;
    const conditionsDiv = document.getElementById('queryConditions');
    const rowId = `queryCondRow${conditionCount}`;
    const row = document.createElement('div');
    row.className = 'mb-2 d-flex align-items-center';
    row.id = rowId;
    row.innerHTML = `
      <div class="d-flex w-100" style="gap:8px;">
        <div style="width:16%;">
          <select class="form-select" id="queryLayer${conditionCount}">
            <option value="" selected disabled>Select Layer...</option>
            <option value="Herostones">Herostones</option>
            <option value="Inscriptions">Inscriptions</option>
            <option value="Temples">Temples</option>
          </select>
        </div>
        <div style="width:24%;">
          <select class="form-select" id="queryField${conditionCount}"></select>
        </div>
        <div style="width:18%;">
          <select class="form-select" id="queryOperator${conditionCount}">
            <option value="=">=</option>
            <option value="contains">contains</option>
            <option value="startsWith">starts with</option>
            <option value="endsWith">ends with</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
          </select>
        </div>
        <div style="width:16%;">
          <input type="text" class="form-control" id="queryValue${conditionCount}">
        </div>
        <div style="width:10%;min-width:60px;">
          <select class="form-select" id="queryLogic${conditionCount}">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
        <div style="display:flex;align-items:end;">
          <button type="button" class="btn btn-sm btn-danger" id="removeCondBtn${conditionCount}" title="Remove"><i class="fa fa-times"></i></button>
        </div>
      </div>
    `;
    conditionsDiv.appendChild(row);
    document.getElementById(`removeCondBtn${conditionCount}`).onclick = function() {
      row.remove();
    };
    // Populate fields when layer changes
    document.getElementById(`queryLayer${conditionCount}`).addEventListener('change', function() {
      updateFieldsForRow(conditionCount);
    });
    // Initial field population
    updateFieldsForRow(conditionCount);
  }

  function updateFieldsForRow(idx) {
  var layerSelect = document.getElementById(`queryLayer${idx}`);
  var layerName = layerSelect ? layerSelect.value : '';
    var fieldSelect = document.getElementById(`queryField${idx}`);
    fieldSelect.innerHTML = '';
    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Select Attribute...';
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    fieldSelect.appendChild(defaultOpt);
    var sampleFeature = null;
    var layerLoaded = false;
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
    if (!layerLoaded) {
      var opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Layer not loaded';
      fieldSelect.appendChild(opt);
    } else {
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

  // No global layer dropdown; layer selection is per condition row
  // Add first condition row by default
  addConditionRow();
  document.getElementById('addConditionBtn').onclick = addConditionRow;

  // Query logic
  document.getElementById('queryForm').onsubmit = function(e) {
    e.preventDefault();
    // Gather all conditions, each with its layer
    var conditions = [];
    for (let i = 1; i <= conditionCount; i++) {
      var layerEl = document.getElementById(`queryLayer${i}`);
      var fieldEl = document.getElementById(`queryField${i}`);
      var opEl = document.getElementById(`queryOperator${i}`);
      var valEl = document.getElementById(`queryValue${i}`);
      var logicEl = document.getElementById(`queryLogic${i}`);
      if (layerEl && fieldEl && opEl && valEl && logicEl && layerEl.value && fieldEl.value && opEl.value && valEl.value && logicEl.value) {
        conditions.push({ layer: layerEl.value, field: fieldEl.value, operator: opEl.value, value: valEl.value, logic: logicEl.value });
      }
    }
    // Get features from all layers
    var layerMap = {
      'Herostones': window.herostonesLayer,
      'Inscriptions': window.inscriptionsLayer,
      'Temples': window.templesLayer
    };
    var allResults = [];
    Object.keys(layerMap).forEach(function(layerName) {
      var layer = layerMap[layerName];
      if (!layer) return;
      var features = layer.toGeoJSON().features;
      features.forEach(function(f) {
        // Get conditions for this layer
        var layerConds = conditions.filter(c => c.layer === layerName);
        if (layerConds.length === 0) return;
        // Evaluate per-condition logic chain
        let match = false;
        if (layerConds.length === 1) {
          // Only one condition, use its logic
          var cond = layerConds[0];
          var prop = f.properties[cond.field];
          match = (cond.operator === '=' && prop == cond.value)
            || (cond.operator === 'contains' && (prop + '').toLowerCase().includes(cond.value.toLowerCase()))
            || (cond.operator === 'startsWith' && (prop + '').toLowerCase().startsWith(cond.value.toLowerCase()))
            || (cond.operator === 'endsWith' && (prop + '').toLowerCase().endsWith(cond.value.toLowerCase()))
            || (cond.operator === '>' && parseFloat(prop) > parseFloat(cond.value))
            || (cond.operator === '<' && parseFloat(prop) < parseFloat(cond.value));
        } else {
          // Multiple conditions, chain logic
          // Start with first condition
          var prop = f.properties[layerConds[0].field];
          match = (layerConds[0].operator === '=' && prop == layerConds[0].value)
            || (layerConds[0].operator === 'contains' && (prop + '').toLowerCase().includes(layerConds[0].value.toLowerCase()))
            || (layerConds[0].operator === 'startsWith' && (prop + '').toLowerCase().startsWith(layerConds[0].value.toLowerCase()))
            || (layerConds[0].operator === 'endsWith' && (prop + '').toLowerCase().endsWith(layerConds[0].value.toLowerCase()))
            || (layerConds[0].operator === '>' && parseFloat(prop) > parseFloat(layerConds[0].value))
            || (layerConds[0].operator === '<' && parseFloat(prop) < parseFloat(layerConds[0].value));
          // Apply each subsequent condition with its logic
          for (let j = 1; j < layerConds.length; j++) {
            var cond = layerConds[j];
            var prop = f.properties[cond.field];
            var condMatch = (cond.operator === '=' && prop == cond.value)
              || (cond.operator === 'contains' && (prop + '').toLowerCase().includes(cond.value.toLowerCase()))
              || (cond.operator === 'startsWith' && (prop + '').toLowerCase().startsWith(cond.value.toLowerCase()))
              || (cond.operator === 'endsWith' && (prop + '').toLowerCase().endsWith(cond.value.toLowerCase()))
              || (cond.operator === '>' && parseFloat(prop) > parseFloat(cond.value))
              || (cond.operator === '<' && parseFloat(prop) < parseFloat(cond.value));
            if (layerConds[j].logic === 'AND') {
              match = match && condMatch;
            } else {
              match = match || condMatch;
            }
          }
        }
        if (match) {
          f._queryLayer = layerName;
          allResults.push(f);
        }
      });
    });
    var results = allResults;
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
      html += '<th>Layer</th>';
      // Get all unique keys from all results
      var allKeys = new Set();
      results.forEach(f => Object.keys(f.properties).forEach(k => allKeys.add(k)));
      allKeys = Array.from(allKeys);
      allKeys.forEach(function(k) { html += '<th>' + k + '</th>'; });
      html += '</tr></thead><tbody>';
      for (var i = start; i < end; i++) {
        var f = results[i];
        html += '<tr>';
        // Layer column
        html += `<td style="font-weight:bold;color:#72383d;">${f._queryLayer || ''}</td>`;
        // Data columns
        allKeys.forEach(function(k) {
          var cellValue = f.properties[k] !== undefined ? f.properties[k] : '';
          var highlight = '';
          var innerHtml = cellValue + '';
          let matched = false;
          // For 'contains', collect all substrings to highlight
          let highlightRanges = [];
          for (let condIdx = 0; condIdx < conditions.length; condIdx++) {
            var cond = conditions[condIdx];
            if ((f._queryLayer === cond.layer) && (k === cond.field)) {
              let valStr = cellValue + '';
              if (cond.operator === '=') {
                if (cellValue == cond.value) {
                  matched = true;
                  highlightRanges.push({start:0, end:valStr.length});
                }
              }
              if (cond.operator === 'contains') {
                let lowerValStr = valStr.toLowerCase();
                let lowerCondVal = cond.value.toLowerCase();
                let idx = 0;
                while ((idx = lowerValStr.indexOf(lowerCondVal, idx)) !== -1) {
                  matched = true;
                  highlightRanges.push({start:idx, end:idx+cond.value.length});
                  idx += cond.value.length;
                }
              }
              if (cond.operator === 'startsWith') {
                if (valStr.toLowerCase().startsWith(cond.value.toLowerCase())) {
                  matched = true;
                  highlightRanges.push({start:0, end:cond.value.length});
                }
              }
              if (cond.operator === 'endsWith') {
                if (valStr.toLowerCase().endsWith(cond.value.toLowerCase())) {
                  matched = true;
                  highlightRanges.push({start:valStr.length-cond.value.length, end:valStr.length});
                }
              }
              if (cond.operator === '>' && parseFloat(cellValue) > parseFloat(cond.value)) {
                matched = true;
                highlightRanges.push({start:0, end:valStr.length});
              }
              if (cond.operator === '<' && parseFloat(cellValue) < parseFloat(cond.value)) {
                matched = true;
                highlightRanges.push({start:0, end:valStr.length});
              }
            }
          }
          // Merge overlapping highlight ranges
          if (highlightRanges.length > 0) {
            highlight = 'background:yellow;font-weight:bold;';
            // Sort and merge ranges
            highlightRanges.sort((a,b)=>a.start-b.start);
            let merged = [];
            for (let r of highlightRanges) {
              if (!merged.length || merged[merged.length-1].end < r.start) {
                merged.push({...r});
              } else {
                merged[merged.length-1].end = Math.max(merged[merged.length-1].end, r.end);
              }
            }
            // Build highlighted HTML
            let out = '';
            let last = 0;
            for (let m of merged) {
              if (last < m.start) out += innerHtml.substring(last, m.start);
              out += `<span style='background:lightgreen;'>${innerHtml.substring(m.start, m.end)}</span>`;
              last = m.end;
            }
            if (last < innerHtml.length) out += innerHtml.substring(last);
            innerHtml = out;
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

    // Show only matched markers for layers involved in the query
    var involvedLayers = Array.from(new Set(conditions.map(c => c.layer)));
    var layerMap = {
      'Herostones': window.herostonesLayer,
      'Inscriptions': window.inscriptionsLayer,
      'Temples': window.templesLayer
    };
    // For each involved layer, clear and add only matched features
    involvedLayers.forEach(function(layerName) {
      var layer = layerMap[layerName];
      if (!layer) return;
      layer.clearLayers();
      // Get matched features for this layer
      var matchedFeatures = results.filter(f => f._queryLayer === layerName);
      layer.addData({type:'FeatureCollection',features:matchedFeatures});
    });
    // Optionally, fit bounds to all matched features
    if (results.length > 0) {
      var allBounds = null;
      results.forEach(function(f) {
        var layer = layerMap[f._queryLayer];
        if (layer) {
          var featureLayer = L.geoJSON(f);
          var bounds = featureLayer.getBounds();
          if (!allBounds) allBounds = bounds;
          else allBounds.extend(bounds);
        }
      });
      if (allBounds) window.map.fitBounds(allBounds, {padding: [40,40], maxZoom: 15});
    }
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

