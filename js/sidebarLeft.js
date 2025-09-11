// Clean, working sidebar initialization and tab logic with draggable sidebar
// Place this as the ONLY code in sidebarLeft.js

document.addEventListener('DOMContentLoaded', function() {
  var leftSidebar = document.getElementById('leftSidebar');
  leftSidebar.style.width = '350px'; // Set default width to 350px
  leftSidebar.innerHTML = `
    <style>
      #leftSidebar {
        overflow-x: hidden;
      }
      #leftSidebarTabs.flex-column .nav-link {
        display: flex !important;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 48px;
        padding: 0;
      }
    </style>
    <div id="leftSidebarDragHandle" style="position:absolute;top:0;right:0;width:8px;height:100%;cursor:ew-resize;z-index:10;"></div>
    <ul class="nav nav-tabs d-flex flex-row" id="leftSidebarTabs" style="gap:4px;">
      <li class="nav-item flex-fill"><a class="nav-link active text-center" data-tab="layers"><span class="tab-text">Layers</span></a></li>
      <li class="nav-item flex-fill"><a class="nav-link text-center" data-tab="filters"><span class="tab-text">Filters</span></a></li>
      <li class="nav-item flex-fill"><a class="nav-link text-center" data-tab="spatial"><span class="tab-text">Spatial Filter</span></a></li>
    </ul>
    <div id="leftSidebarContent"></div>
  `;

  // Add toggle button outside sidebar
  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggleLeftSidebar';
  toggleBtn.className = 'btn btn-sm btn-secondary';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.left = (leftSidebar.offsetLeft + leftSidebar.offsetWidth) + 'px';
  toggleBtn.style.top = leftSidebar.offsetTop + 'px';
  toggleBtn.style.zIndex = '1102';

  // Update button position when sidebar is resized or toggled
  function updateToggleBtnPosition() {
    toggleBtn.style.left = (leftSidebar.offsetLeft + leftSidebar.offsetWidth) + 'px';
    toggleBtn.style.top = leftSidebar.offsetTop + 'px';
  }
  window.addEventListener('resize', updateToggleBtnPosition);
  new ResizeObserver(updateToggleBtnPosition).observe(leftSidebar);
  toggleBtn.innerHTML = '<span id="leftSidebarIcon" class="bi bi-chevron-left"></span>';
  document.body.appendChild(toggleBtn);

  var leftTabs = document.querySelectorAll('#leftSidebarTabs .nav-link');
  var leftSidebarContent = document.getElementById('leftSidebarContent');

  function showLeftTab(tab) {
    if(tab === 'layers') {
      console.log('[SidebarLeft] Switching to Layers tab');
      if(typeof renderLayersTab === 'function') {
        renderLayersTab(leftSidebarContent);
      } else {
        leftSidebarContent.innerHTML = '';
      }
    }
    if(tab === 'filters') {
      console.log('[SidebarLeft] Switching to Filters tab');
      if(typeof renderFiltersTab === 'function') {
        renderFiltersTab(leftSidebarContent);
      } else {
        console.error('[SidebarLeft] renderFiltersTab is not a function');
        leftSidebarContent.innerHTML = '<div class="text-danger">Error: Filters panel could not be loaded.</div>';
      }
    }
    if(tab === 'spatial') {
      console.log('[SidebarLeft] Switching to Spatial Filter tab');
      if(typeof renderSpatialFilterTab === 'function') {
        renderSpatialFilterTab(leftSidebarContent);
      } else {
        leftSidebarContent.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... Spatial Filter</strong></div>`;
      }
    }
  }

  leftTabs.forEach(tab => {
    tab.onclick = function() {
      leftTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showLeftTab(tab.dataset.tab);
    };
  });

  // Show Layers tab by default
  showLeftTab('layers');

  function scaleTabIcons(sizePx) {
    var tabIcons = document.querySelectorAll('#leftSidebarTabs .tab-icon');
    tabIcons.forEach(function(icon) {
      icon.style.fontSize = sizePx + 'px';
      icon.style.width = sizePx + 'px';
      icon.style.height = sizePx + 'px';
      icon.style.maxWidth = '100%';
      icon.style.maxHeight = '100%';
    });
  }

  document.getElementById('toggleLeftSidebar').onclick = function() {
    var content = document.getElementById('leftSidebarContent');
    var icon = document.getElementById('leftSidebarIcon');
    var tabTexts = document.querySelectorAll('#leftSidebarTabs .tab-text');
    var leftSidebarTabs = document.getElementById('leftSidebarTabs');
    var tabIcons = document.querySelectorAll('#leftSidebarTabs .tab-icon');
    if (content.style.display === 'none') {
      content.style.display = '';
      icon.className = 'bi bi-chevron-left';
      leftSidebar.style.width = '350px';
      tabTexts.forEach(function(el) { el.style.display = ''; });
      leftSidebarTabs.classList.remove('flex-column');
      leftSidebarTabs.classList.add('flex-row');
      leftSidebarTabs.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('py-3','justify-content-center','align-items-center');
        link.classList.add('text-center');
        link.style.display = '';
        link.style.height = '';
        link.style.padding = '';
        link.style.flexDirection = '';
        link.style.alignItems = '';
        link.style.justifyContent = '';
      });
    } else {
      content.style.display = 'none';
      icon.className = 'bi bi-chevron-right';
      leftSidebar.style.width = '48px'; // collapsed width, fits icons
      tabTexts.forEach(function(el) { el.style.display = 'none'; });
      leftSidebarTabs.classList.remove('flex-row');
      leftSidebarTabs.classList.add('flex-column');
      leftSidebarTabs.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('text-center');
        link.classList.add('justify-content-center','align-items-center');
        link.style.display = 'flex';
        link.style.flexDirection = 'column';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.height = '48px';
        link.style.padding = '0';
      });
    }
  };
  // Initial icon scaling
  scaleTabIcons(24);

  // Draggable sidebar width
  var dragHandle = document.getElementById('leftSidebarDragHandle');
  var isDragging = false;
  var startX, startWidth;

  dragHandle.addEventListener('mousedown', function(e) {
    // Only allow drag when expanded
    if (leftSidebar.style.width !== '48px') {
      isDragging = true;
      startX = e.clientX;
      startWidth = parseInt(document.defaultView.getComputedStyle(leftSidebar).width, 10);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    var newWidth = startWidth + (e.clientX - startX);
    if (newWidth < 150) newWidth = 150;
    if (newWidth > 600) newWidth = 600;
    leftSidebar.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
});
