
/**
 * chart.js
 * Utility for rendering charts using Chart.js in WebGIS
 * All logic preserved, only code style and comments improved.
 */

/**
 * Renders a bar chart using Chart.js
 * @param {object} data - Chart.js data object
 */
function renderChart(data) {
  var chartEl = document.getElementById('chart');
  if (!chartEl) {
    console.error('Chart element not found.');
    return;
  }
  var ctx = chartEl.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {}
  });
}
