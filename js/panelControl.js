/**
 * panelControl.js
 * Enhanced panel toggle functionality for WebGIS application
 */

const PanelControl = (function() {
    // Configuration
    const config = {
        mobileBreakpoint: 768,
        panelLeftId: 'panelLeft',
        panelRightId: 'panelRight',
        panelLeftToggleId: 'panelLeftToggle',
        panelRightToggleId: 'panelRightToggle',
        panelLeftArrowId: 'panelLeftArrow',
        panelRightArrowId: 'panelRightArrow',
        collapsedClass: 'collapsed',
        activeClass: 'active',
        expandedLeftPosition: '0px',
        expandedRightPosition: '0px',
        collapsedLeftPosition: '-320px',
        collapsedRightPosition: '-320px',
        expandedArrowRotation: 'rotate(0deg)',
        collapsedArrowRotation: 'rotate(180deg)',
        panelStateKey: 'webgis-panel-state',
        transitionDuration: 300 // ms
    };

    // Keep track of panel states
    const state = {
        leftPanelExpanded: true,
        rightPanelExpanded: true,
        isMobileView: false
    };

    // Get DOM elements
    function getElements() {
        return {
            leftPanel: document.getElementById(config.panelLeftId),
            rightPanel: document.getElementById(config.panelRightId),
            leftToggle: document.getElementById(config.panelLeftToggleId),
            rightToggle: document.getElementById(config.panelRightToggleId),
            leftArrow: document.getElementById(config.panelLeftArrowId),
            rightArrow: document.getElementById(config.panelRightArrowId)
        };
    }

    // Initialize panel control
    function init() {
        const elements = getElements();

        // Check if we found all required elements
        if (!elements.leftPanel || !elements.rightPanel || 
            !elements.leftToggle || !elements.rightToggle) {
            console.error("Panel control initialization failed: Missing required elements");
            return;
        }
        
        // Use AppState if available, otherwise fall back to localStorage
        if (window.AppState) {
            // Get initial state from AppState
            const uiState = window.AppState.get('ui');
            if (uiState) {
                state.leftPanelExpanded = uiState.leftPanelExpanded;
                state.rightPanelExpanded = uiState.rightPanelExpanded;
                state.isMobileView = uiState.isMobile;
            }
            
            // Subscribe to state changes
            window.AppState.subscribe('ui', function(newState) {
                if (newState.leftPanelExpanded !== state.leftPanelExpanded ||
                    newState.rightPanelExpanded !== state.rightPanelExpanded) {
                    state.leftPanelExpanded = newState.leftPanelExpanded;
                    state.rightPanelExpanded = newState.rightPanelExpanded;
                    applyPanelState();
                }
            });
        } else {
            // Fall back to localStorage
            loadPanelState();
            
            // Check if we're in mobile view
            checkMobileView();
        }
        
        // Apply initial panel states
        applyPanelState();

        // Set up event listeners for panel toggles
        setupToggleListeners();

        // Listen for window resize to handle responsive behavior
        window.addEventListener('resize', handleResize);

        console.log("Panel control initialized");
    }

    // Check if we're in mobile view
    function checkMobileView() {
        state.isMobileView = window.innerWidth <= config.mobileBreakpoint;
        
        // In mobile view, we don't want both panels expanded by default
        if (state.isMobileView && state.leftPanelExpanded && state.rightPanelExpanded) {
            // Prefer keeping the left panel open on mobile
            state.rightPanelExpanded = false;
        }
    }

    // Set up event listeners for toggle buttons
    function setupToggleListeners() {
        const elements = getElements();

        // Left panel toggle
        if (elements.leftToggle) {
            elements.leftToggle.addEventListener('click', function() {
                toggleLeftPanel();
            });
        }

        // Right panel toggle
        if (elements.rightToggle) {
            elements.rightToggle.addEventListener('click', function() {
                toggleRightPanel();
            });
        }
    }

    // Toggle left panel state
    function toggleLeftPanel() {
        state.leftPanelExpanded = !state.leftPanelExpanded;
        
        // If we're in mobile view and opening the left panel, close the right one
        if (state.isMobileView && state.leftPanelExpanded && state.rightPanelExpanded) {
            state.rightPanelExpanded = false;
        }
        
        // Update AppState if available
        if (window.AppState) {
            window.AppState.update('ui', {
                leftPanelExpanded: state.leftPanelExpanded,
                rightPanelExpanded: state.rightPanelExpanded
            });
        } else {
            applyPanelState();
            savePanelState();
        }
    }

    // Toggle right panel state
    function toggleRightPanel() {
        state.rightPanelExpanded = !state.rightPanelExpanded;
        
        // If we're in mobile view and opening the right panel, close the left one
        if (state.isMobileView && state.rightPanelExpanded && state.leftPanelExpanded) {
            state.leftPanelExpanded = false;
        }
        
        // Update AppState if available
        if (window.AppState) {
            window.AppState.update('ui', {
                leftPanelExpanded: state.leftPanelExpanded,
                rightPanelExpanded: state.rightPanelExpanded
            });
        } else {
            applyPanelState();
            savePanelState();
        }
    }

    // Apply current panel states to the DOM
    function applyPanelState() {
        const elements = getElements();
        
        // Apply left panel state
        if (elements.leftPanel && elements.leftArrow) {
            elements.leftPanel.style.left = state.leftPanelExpanded ? 
                config.expandedLeftPosition : config.collapsedLeftPosition;
            elements.leftArrow.style.transform = state.leftPanelExpanded ? 
                config.expandedArrowRotation : config.collapsedArrowRotation;
            // Update toggle button class
            if (elements.leftToggle) {
                elements.leftToggle.classList.toggle(config.activeClass, state.leftPanelExpanded);
            }
            // Accessibility: inert and tabindex for left panel
            if (!state.leftPanelExpanded) {
                elements.leftPanel.setAttribute('aria-hidden', 'true');
                elements.leftPanel.setAttribute('inert', '');
                var focusables = elements.leftPanel.querySelectorAll('a, button, input, select, textarea, [tabindex]');
                focusables.forEach(function(el) {
                    el.setAttribute('tabindex', '-1');
                });
                // Move focus to body if panel is hidden and contains focused element
                if (elements.leftPanel.contains(document.activeElement)) {
                    document.body.focus();
                }
            } else {
                elements.leftPanel.setAttribute('aria-hidden', 'false');
                elements.leftPanel.removeAttribute('inert');
                var focusables = elements.leftPanel.querySelectorAll('a, button, input, select, textarea, [tabindex]');
                focusables.forEach(function(el) {
                    el.removeAttribute('tabindex');
                });
            }
        }
        
        // Apply right panel state
        if (elements.rightPanel && elements.rightArrow) {
            elements.rightPanel.style.right = state.rightPanelExpanded ? 
                config.expandedRightPosition : config.collapsedRightPosition;
            
            elements.rightArrow.style.transform = state.rightPanelExpanded ? 
                config.expandedArrowRotation : config.collapsedArrowRotation;
                
            // Update toggle button class
            if (elements.rightToggle) {
                elements.rightToggle.classList.toggle(config.activeClass, state.rightPanelExpanded);
            }
        }

        // Update body classes for styling purposes
        document.body.classList.toggle('has-left-panel', state.leftPanelExpanded);
        document.body.classList.toggle('has-right-panel', state.rightPanelExpanded);
        
        // Update query section positioning (if the function exists)
        if (typeof resizeQuerySection === 'function') {
            setTimeout(resizeQuerySection, config.transitionDuration);
        }
        
        // Trigger map resize after panel state change to fix map rendering issues
        if (window.map && typeof window.map.invalidateSize === 'function') {
            setTimeout(() => window.map.invalidateSize(), config.transitionDuration);
        }
    }

    // Handle window resize events
    function handleResize() {
        const wasMobile = state.isMobileView;
        checkMobileView();
        
        // If we switched between mobile/desktop mode, update panel states
        if (wasMobile !== state.isMobileView) {
            applyPanelState();
        }
    }

    // Save panel state to localStorage
    function savePanelState() {
        try {
            const data = {
                leftExpanded: state.leftPanelExpanded,
                rightExpanded: state.rightPanelExpanded
            };
            localStorage.setItem(config.panelStateKey, JSON.stringify(data));
        } catch (e) {
            console.warn("Failed to save panel state to localStorage:", e);
        }
    }

    // Load panel state from localStorage
    function loadPanelState() {
        try {
            const saved = localStorage.getItem(config.panelStateKey);
            if (saved) {
                const data = JSON.parse(saved);
                state.leftPanelExpanded = !!data.leftExpanded;
                state.rightPanelExpanded = !!data.rightExpanded;
            }
        } catch (e) {
            console.warn("Failed to load panel state from localStorage:", e);
        }
    }

    // Directly set panel states programmatically
    function setPanelState(left, right) {
        if (typeof left === 'boolean') state.leftPanelExpanded = left;
        if (typeof right === 'boolean') state.rightPanelExpanded = right;
        
        // Update AppState if available
        if (window.AppState) {
            window.AppState.update('ui', {
                leftPanelExpanded: state.leftPanelExpanded,
                rightPanelExpanded: state.rightPanelExpanded
            });
        } else {
            applyPanelState();
            savePanelState();
        }
    }

    // Public API
    return {
        init: init,
        toggleLeftPanel: toggleLeftPanel,
        toggleRightPanel: toggleRightPanel,
        setPanelState: setPanelState,
        getState: function() {
            return { ...state }; // Return copy of state
        },
        applyState: applyPanelState
    };
})();

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    PanelControl.init();
    
    // Set both panels to expanded by default after initialization
    // This ensures they're properly expanded regardless of localStorage state
    PanelControl.setPanelState(true, true);

    // --- Draggable resize logic for left/right panel edges ---
    var leftPanel = document.getElementById('panelLeft');
    var rightPanel = document.getElementById('panelRight');
    var leftDragEdge = document.getElementById('panelLeftDragEdge');
    var rightDragEdge = document.getElementById('panelRightDragEdge');
    var mainContent = document.getElementById('mainContent');
    var minPanelWidth = 180, maxPanelWidth = 600;

    function startDrag(e, panel, edge, isLeft) {
      e.preventDefault();
      document.body.style.cursor = 'ew-resize';
      var startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      var startWidth = panel.offsetWidth;
      function onMove(ev) {
        var clientX = ev.type.startsWith('touch') ? ev.touches[0].clientX : ev.clientX;
        var delta = isLeft ? (clientX - startX) : (startX - clientX);
        var newWidth = Math.min(maxPanelWidth, Math.max(minPanelWidth, startWidth + delta));
        panel.style.width = newWidth + 'px';
        if (mainContent) {
          if (isLeft) mainContent.style.marginLeft = newWidth + 'px';
          else mainContent.style.marginRight = newWidth + 'px';
        }
      }
      function onUp() {
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('touchend', onUp);
    }
    if (leftDragEdge && leftPanel) {
      leftDragEdge.addEventListener('mousedown', function(e) { startDrag(e, leftPanel, leftDragEdge, true); });
      leftDragEdge.addEventListener('touchstart', function(e) { startDrag(e, leftPanel, leftDragEdge, true); });
    }
    if (rightDragEdge && rightPanel) {
      rightDragEdge.addEventListener('mousedown', function(e) { startDrag(e, rightPanel, rightDragEdge, false); });
      rightDragEdge.addEventListener('touchstart', function(e) { startDrag(e, rightPanel, rightDragEdge, false); });
    }
});
