// Navbar logic (if needed for dynamic behavior)
// Example: highlight active link, add custom events

document.addEventListener('DOMContentLoaded', function() {
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  var queryBtn = document.getElementById('queryBtn');
  if (queryBtn) {
    queryBtn.addEventListener('click', function() {
      // Now handled by queryWidget.js
      // alert('Query widget coming soon!');
    });
  }

  // Navbar search logic
  var searchForm = document.querySelector('form[role="search"]');
  var searchInput = document.getElementById('navbarSearchInput');
  var searchBtn = document.getElementById('navbarSearchBtn');
  if (searchForm && searchInput && searchBtn) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var query = searchInput.value.trim();
      if (query.length > 0) {
        // Dispatch a custom event for full-text search
        document.dispatchEvent(new CustomEvent('navbarFullTextSearch', { detail: { query: query } }));
      }
    });
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var query = searchInput.value.trim();
      if (query.length > 0) {
        document.dispatchEvent(new CustomEvent('navbarFullTextSearch', { detail: { query: query } }));
      }
    });
  }
});
