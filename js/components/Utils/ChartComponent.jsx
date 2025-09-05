// ChartComponent for WebGIS application
// No import/export statements for browser-based usage

function ChartComponent({ data }) {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  React.useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    
    // Use the same marker/cluster colors as on the map
    const markerColors = [
      '#a259c4', // Herostones (Violet)
      '#f85032', // Inscriptions (Red)
      '#ffd200'  // Temples (Yellow)
    ];
    
    // Make sure Chart.js is available in the global scope
    if (window.Chart) {
      chartInstance.current = new window.Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.name),
          datasets: [{
            label: 'Heritage Sites',
            data: data.map(d => d.value || 1),
            backgroundColor: markerColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          },
          cutout: '65%'
        }
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <>
      <div style={{width: 240, height: 240, margin: '0 auto'}}>
        <canvas ref={chartRef} width={240} height={240}></canvas>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
        {data.map((item, index) => (
          <div key={index} style={{display: 'flex', alignItems: 'center', marginRight: '15px'}}>
            <div style={{
              width: '12px', 
              height: '12px', 
              backgroundColor: ['#a259c4', '#f85032', '#ffd200'][index],
              marginRight: '5px'
            }}></div>
            <span style={{fontSize: '0.9em'}}>{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </>
  );
}

// Make ChartComponent available globally
window.ChartComponent = ChartComponent;
