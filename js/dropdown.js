/**
 * dropdown.js
 * Utility for managing dropdown menus in the WebGIS application
 */

const DropdownManager = (function() {
    // Track registered dropdowns
    const registeredDropdowns = new Map();

    // Close all dropdowns except the specified one
    function closeAllExcept(exceptId) {
        registeredDropdowns.forEach((handlers, id) => {
            if (id !== exceptId) {
                const list = document.getElementById(id);
                if (list) {
                    list.style.display = 'none';
                }
            }
        });
    }

    // Document click handler to close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        // Close all dropdowns when clicking outside any dropdown
        let insideDropdown = false;
        
        registeredDropdowns.forEach((handlers, id) => {
            const list = document.getElementById(id);
            const button = document.getElementById(handlers.buttonId);
            
            if (list && button) {
                if (button.contains(e.target) || list.contains(e.target)) {
                    insideDropdown = true;
                }
            }
        });
        
        if (!insideDropdown) {
            closeAllExcept(null); // Close all
        }
    });

    // Register a new dropdown
    function register(options) {
        const {
            buttonId,         // ID of the button that toggles the dropdown
            dropdownId,       // ID of the dropdown container
            itemSelector,     // Selector for items inside the dropdown (optional)
            onSelect,         // Callback when an item is selected (optional)
            multiple = false, // Whether multiple selections are allowed
            itemRenderer      // Function to render dropdown items (optional)
        } = options;

        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);
        
        if (!button || !dropdown) {
            console.error(`Dropdown registration failed: Elements not found for ${buttonId} or ${dropdownId}`);
            return false;
        }
        
        // Register button click handler to toggle dropdown
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isVisible = dropdown.style.display !== 'none';
            
            // Close all other dropdowns
            closeAllExcept(isVisible ? null : dropdownId);
            
            // Toggle this dropdown
            dropdown.style.display = isVisible ? 'none' : '';
        });
        
        // Register click handler for dropdown items if selector is provided
        if (itemSelector) {
            dropdown.addEventListener('click', function(e) {
                const item = e.target.closest(itemSelector);
                if (!item) return;
                
                if (onSelect && typeof onSelect === 'function') {
                    onSelect(item, e);
                }
                
                // If not multiple selection, close dropdown after selection
                if (!multiple) {
                    dropdown.style.display = 'none';
                }
            });
        }
        
        // Store handlers for future reference
        registeredDropdowns.set(dropdownId, {
            buttonId,
            multiple,
            onSelect
        });
        
        // If itemRenderer is provided, use it to populate the dropdown
        if (itemRenderer && typeof itemRenderer === 'function') {
            itemRenderer(dropdown);
        }
        
        return true;
    }

    // Setup a checkbox-based multi-select dropdown
    function setupMultiSelect(options) {
        const {
            buttonId,
            dropdownId,
            data,              // Array of items or function returning array
            valueField,        // Field name for values
            textField,         // Field name for display text
            onSelectionChange, // Callback when selection changes
            buttonTextLimit = 25 // Character limit for button text
        } = options;
        
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);
        
        if (!button || !dropdown) {
            console.error(`MultiSelect setup failed: Elements not found for ${buttonId} or ${dropdownId}`);
            return false;
        }
        
        // Function to render items in the dropdown
        const renderItems = () => {
            const items = typeof data === 'function' ? data() : data;
            if (!Array.isArray(items)) {
                console.error('MultiSelect data must be an array or a function returning an array');
                return;
            }
            
            dropdown.innerHTML = '';
            items.forEach((item, index) => {
                const value = item[valueField] || item;
                const text = item[textField] || item;
                
                const id = `multiselect_${dropdownId}_${index}`;
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.style.padding = '6px 12px';
                div.style.cursor = 'pointer';
                
                div.innerHTML = `
                    <input type="checkbox" id="${id}" value="${value}" style="margin-right:8px;">
                    <label for="${id}">${text}</label>
                `;
                
                dropdown.appendChild(div);
            });
        };
        
        // Function to update button text based on selection
        const updateButtonText = () => {
            const selected = Array.from(
                dropdown.querySelectorAll('input[type=checkbox]:checked')
            ).map(cb => cb.labels[0].textContent);
            
            if (selected.length === 0) {
                button.textContent = 'Select...';
            } else if (selected.length === 1) {
                button.textContent = selected[0];
            } else {
                const text = selected.join(', ');
                button.textContent = text.length > buttonTextLimit ? 
                    `${selected.length} items selected` : text;
            }
            
            // Store selection for external access
            button.dataset.selectedValues = JSON.stringify(
                Array.from(dropdown.querySelectorAll('input[type=checkbox]:checked'))
                    .map(cb => cb.value)
            );
        };
        
        // Register dropdown with the manager
        register({
            buttonId,
            dropdownId,
            multiple: true,
            itemRenderer: renderItems
        });
        
        // Add change listener for checkboxes
        dropdown.addEventListener('change', function() {
            updateButtonText();
            
            if (onSelectionChange && typeof onSelectionChange === 'function') {
                const selected = Array.from(
                    dropdown.querySelectorAll('input[type=checkbox]:checked')
                ).map(cb => cb.value);
                
                onSelectionChange(selected);
            }
        });
        
        // Initial render
        renderItems();
        updateButtonText();
        
        // Public methods for this dropdown instance
        return {
            getSelected: () => {
                return Array.from(
                    dropdown.querySelectorAll('input[type=checkbox]:checked')
                ).map(cb => cb.value);
            },
            setSelected: (values) => {
                if (!Array.isArray(values)) values = [values];
                
                dropdown.querySelectorAll('input[type=checkbox]').forEach(cb => {
                    cb.checked = values.includes(cb.value);
                });
                
                updateButtonText();
            },
            refresh: () => {
                renderItems();
                updateButtonText();
            }
        };
    }

    // Public API
    return {
        register,
        setupMultiSelect,
        closeAll: () => closeAllExcept(null)
    };
})();

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DropdownManager initialized");
});
