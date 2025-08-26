// --- CHIP FUNCTIONALITY FOR FILTERS ---
function updateChips(selectId, chipContainerId) {
	var select = document.getElementById(selectId);
	var chipContainer = document.getElementById(chipContainerId);
	if (!select || !chipContainer) return;
	chipContainer.innerHTML = '';
	   Array.from(select.options).forEach(function(option) {
		   if (option.selected && option.value) {
			   var chip = document.createElement('span');
			   chip.className = 'chip';
			   chip.textContent = option.text;
			   // Dynamically set chip color for Type of Herostone
			   if (selectId === 'sel_TypeofHerostone' && window.herostoneTypeColors) {
				   var color = window.herostoneTypeColors[option.value];
				   if (color) {
					   chip.style.background = color;
					   // Calculate contrast: use black or white font for best readability
					   function getContrastYIQ(hexcolor) {
						   hexcolor = hexcolor.replace('#', '');
						   if (hexcolor.length === 3) {
							   hexcolor = hexcolor[0]+hexcolor[0]+hexcolor[1]+hexcolor[1]+hexcolor[2]+hexcolor[2];
						   }
						   var r = parseInt(hexcolor.substr(0,2),16);
						   var g = parseInt(hexcolor.substr(2,2),16);
						   var b = parseInt(hexcolor.substr(4,2),16);
						   var yiq = ((r*299)+(g*587)+(b*114))/1000;
						   return (yiq >= 128) ? '#000' : '#fff';
					   }
					   chip.style.color = getContrastYIQ(color);
				   }
			   }
			   var removeBtn = document.createElement('button');
			   removeBtn.className = 'chip-remove';
			   removeBtn.type = 'button';
			   removeBtn.innerHTML = '&times;';
			   removeBtn.onclick = function(e) {
				   option.selected = false;
				   // Also uncheck in custom dropdown UI if present
				   var wrapper = select.parentNode.querySelector('.ms-dropdown-wrapper');
				   if (wrapper) {
					   var checkboxes = wrapper.querySelectorAll('input[type=checkbox]');
					   checkboxes.forEach(function(cb) {
						   if (cb.value === option.value) cb.checked = false;
					   });
					   var btn = wrapper.querySelector('.ms-dropdown-btn');
					   if (btn) btn.textContent = 'Select...';
				   }
				   // Trigger change event
				   var event = new Event('change', { bubbles: true });
				   select.dispatchEvent(event);
			   };
			   chip.appendChild(removeBtn);
			   chipContainer.appendChild(chip);
		   }
	   });
}

function enableChipFilters() {
	var chipFilters = [
		{ select: 'sel_WithorWithoutInscription', chips: 'chips_WithorWithoutInscription' },
		{ select: 'sel_District', chips: 'chips_District' },
		{ select: 'sel_TypeofHerostone', chips: 'chips_TypeofHerostone' },
		{ select: 'sel_ConservationStatus', chips: 'chips_ConservationStatus' },
		{ select: 'sel_ScriptoftheInscription', chips: 'chips_ScriptoftheInscription' }
	];
	chipFilters.forEach(function(f) {
		var select = document.getElementById(f.select);
		if (!select) return;
		select.addEventListener('change', function() {
			updateChips(f.select, f.chips);
		});
		// Initial render
		updateChips(f.select, f.chips);
	});
}

// Call after DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', enableChipFilters);
} else {
	enableChipFilters();
}
