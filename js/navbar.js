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
});
