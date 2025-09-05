// FilterPanel.js
// Scaffold for the Filters panel (Common and Uncommon Filters)

export default class FilterPanel {
    constructor(options = {}) {
        this.container = options.container || null;
        this.onFilterChange = options.onFilterChange || function(){};
        this.state = {
            common: {
                period: null,
                district: null,
                taluk: null
            },
            uncommon: {
                inscriptions: {},
                herostones: {},
                temples: {}
            }
        };
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = '';
        // Common Filters
        const commonSection = document.createElement('div');
        commonSection.className = 'filter-section common-filters';
        commonSection.innerHTML = `
            <h4>Common Filters</h4>
            <label>Period (Century): <input type="range" min="900" max="2000" step="50" id="filter-period"></label>
            <label>District: <select id="filter-district"><option value="">All</option></select></label>
            <label>Taluk: <select id="filter-taluk"><option value="">All</option></select></label>
        `;
        this.container.appendChild(commonSection);

        // Uncommon Filters
        const uncommonSection = document.createElement('div');
        uncommonSection.className = 'filter-section uncommon-filters';
        uncommonSection.innerHTML = `
            <h4>Uncommon Filters</h4>
            <div id="uncommon-inscriptions"><h5>Inscriptions</h5></div>
            <div id="uncommon-herostones"><h5>Herostones</h5></div>
            <div id="uncommon-temples"><h5>Temples</h5></div>
        `;
        this.container.appendChild(uncommonSection);

        // Attach event listeners for common filters
        this.attachCommonListeners();
    }

    attachCommonListeners() {
        const periodInput = this.container.querySelector('#filter-period');
        const districtSelect = this.container.querySelector('#filter-district');
        const talukSelect = this.container.querySelector('#filter-taluk');
        if (periodInput) {
            periodInput.addEventListener('input', (e) => {
                this.state.common.period = e.target.value;
                this.onFilterChange(this.state);
            });
        }
        if (districtSelect) {
            districtSelect.addEventListener('change', (e) => {
                this.state.common.district = e.target.value;
                this.onFilterChange(this.state);
            });
        }
        if (talukSelect) {
            talukSelect.addEventListener('change', (e) => {
                this.state.common.taluk = e.target.value;
                this.onFilterChange(this.state);
            });
        }
    }

    populateCommonOptions(districts = [], taluks = []) {
        const districtSelect = this.container.querySelector('#filter-district');
        const talukSelect = this.container.querySelector('#filter-taluk');
        if (districtSelect) {
            districtSelect.innerHTML = '<option value="">All</option>' + districts.map(d => `<option value="${d}">${d}</option>`).join('');
        }
        if (talukSelect) {
            talukSelect.innerHTML = '<option value="">All</option>' + taluks.map(t => `<option value="${t}">${t}</option>`).join('');
        }
    }

    // Add methods to render uncommon filters for each dataset as needed
}
