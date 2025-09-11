var tabs = document.querySelectorAll('#rightSidebarTabs .nav-link');
var content = document.getElementById('tabContent');
tabs.forEach(tab=>{
  tab.onclick = ()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    showTab(tab.dataset.tab);
  };
});

var rightSidebar = document.getElementById('rightSidebar');
var rightSidebarToggleBtn = document.createElement('button');
rightSidebarToggleBtn.id = 'toggleRightSidebar';
rightSidebarToggleBtn.className = 'btn btn-sm btn-secondary';
rightSidebarToggleBtn.style.width = '100%';
rightSidebarToggleBtn.style.marginBottom = '10px';
rightSidebarToggleBtn.innerHTML = '<span id="rightSidebarIcon" class="bi bi-chevron-right"></span>';
if (rightSidebar) {
  rightSidebar.insertBefore(rightSidebarToggleBtn, rightSidebar.firstChild);
} else {
  console.warn('rightSidebar element not found. Cannot insert toggle button.');
}

var rightSidebarContent = document.getElementById('tabContent');
rightSidebarToggleBtn.onclick = function() {
  var icon = document.getElementById('rightSidebarIcon');
  if (rightSidebarContent.style.display === 'none') {
    rightSidebarContent.style.display = '';
    icon.className = 'bi bi-chevron-right';
    rightSidebar.style.width = '300px';
  } else {
    rightSidebarContent.style.display = 'none';
    icon.className = 'bi bi-chevron-left';
    rightSidebar.style.width = '50px';
  }
};

function showTab(tab) {
  if(tab === 'about') {
    content.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... About</strong></div>`;
  }
  if(tab === 'features') {
    content.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... Features</strong></div>`;
  }
  if(tab === 'wiki') {
    content.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... Wikipedia</strong></div>`;
  }
  if(tab === 'photos') {
    content.innerHTML = `<div class='text-center mt-3'><strong>Coming soon... Photos</strong></div>`;
  }
}

// Show About tab by default
showTab('about');
