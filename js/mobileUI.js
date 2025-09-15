/**
 * mobileUI.js
 * Handles mobile-specific UI enhancements for the WebGIS application
 */

const MobileUI = (function() {
    // Device detection
    const isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.iOS());
        }
    };

    // Configuration
    const config = {
        mobileBreakpoint: 768, // Width in pixels below which we consider a device to be mobile
        smallScreenClass: 'small-screen',
        mobilePanelClass: 'mobile-panel',
        touchFriendlyClass: 'touch-friendly'
    };

    // Initialize mobile UI enhancements
    function init() {
        // Apply mobile classes if needed
        applyMobileClasses();
        
        // Add resize listener for responsive behavior
        window.addEventListener('resize', applyMobileClasses);
        
        // Enhance touch targets for mobile
        enhanceTouchTargets();
        
        // Improve panel interactions for mobile
        setupMobilePanels();
        
        console.log("Mobile UI enhancements initialized");
    }

    // Apply mobile-specific classes based on screen size
    function applyMobileClasses() {
        const isMobileView = window.innerWidth <= config.mobileBreakpoint;
        document.body.classList.toggle(config.smallScreenClass, isMobileView);
        
        // Add touch-friendly class if on a touch device
        if (isMobile.any()) {
            document.body.classList.add(config.touchFriendlyClass);
        }
    }

    // Enhance buttons and controls for touch
    function enhanceTouchTargets() {
        if (isMobile.any() || window.innerWidth <= config.mobileBreakpoint) {
            // Find all UI controls that need touch enhancement
            const touchTargets = document.querySelectorAll('.leaflet-control a, .btn, button, input[type="checkbox"], input[type="radio"]');
            
            touchTargets.forEach(element => {
                element.classList.add('touch-target');
            });

            // Add special handling for dropdown controls
            const dropdowns = document.querySelectorAll('.dropdown-toggle, .dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.classList.add('mobile-dropdown');
            });
        }
    }

    // Improve panel behavior on mobile
    function setupMobilePanels() {
        // Get panel elements (updated IDs)
        const leftPanel = document.getElementById('panelLeft');
        const rightPanel = document.getElementById('panelRight');
        
        if (!leftPanel || !rightPanel) {
            console.error("Panel elements not found");
            return;
        }

        if (window.innerWidth <= config.mobileBreakpoint) {
            // Add mobile-specific panel classes
            leftPanel.classList.add(config.mobilePanelClass);
            rightPanel.classList.add(config.mobilePanelClass);
            
            // Ensure only one panel can be open at a time on mobile
            setupSinglePanelToggle(leftPanel, rightPanel);
        }
    }

    // Ensure only one panel is open at a time on mobile
    function setupSinglePanelToggle(leftPanel, rightPanel) {
        // Create mutual exclusivity for panels on mobile
        document.querySelectorAll('.sidebar-toggle').forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                const targetId = this.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                const otherPanel = targetId === 'sidebar-left' ? rightPanel : leftPanel;
                
                // If the target panel is being opened, close the other one
                if (targetPanel && !targetPanel.classList.contains('collapsed')) {
                    // Add collapsed class to the other panel
                    if (otherPanel && !otherPanel.classList.contains('collapsed')) {
                        otherPanel.classList.add('collapsed');
                        
                        // Also update the toggle button state for the other panel
                        const otherToggle = document.querySelector(`.sidebar-toggle[data-target="${otherPanel.id}"]`);
                        if (otherToggle) {
                            otherToggle.classList.remove('active');
                        }
                    }
                }
            });
        });
    }

    // Public API
    return {
        init: init,
        isMobileDevice: isMobile.any,
        refreshUI: function() {
            applyMobileClasses();
            enhanceTouchTargets();
            setupMobilePanels();
        }
    };
})();

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    MobileUI.init();
});
