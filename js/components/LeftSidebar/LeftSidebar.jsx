import React from 'react';
import DataSelectionPanel from './DataSelectionPanel';
import FiltersPanel from './FiltersPanel';
import LayersPanel from './LayersPanel';
// ...existing code...
import FeedbackPanel from './FeedbackPanel';

function LeftSidebar({
  showHerostones, setShowHerostones,
  showTemples, setShowTemples,
  showInscriptions, setShowInscriptions,
  opacity, setOpacity,
  basemap, setBasemap,
  clusteringHerostones, setClusteringHerostones,
  clusteringInscriptions, setClusteringInscriptions,
  clusteringTemples, setClusteringTemples,
  herostoneColor, setHerostoneColor,
  herostoneSize, setHerostoneSize,
  herostoneOpacity, setHerostoneOpacity,
  inscriptionColor, setInscriptionColor,
  inscriptionSize, setInscriptionSize,
  inscriptionOpacity, setInscriptionOpacity,
  templeColor, setTempleColor,
  templeSize, setTempleSize,
  templeOpacity, setTempleOpacity
}) {
  return (
    <div id="leaflet-sidebar" className="leaflet-sidebar collapsed">
      <div className="leaflet-sidebar-tabs">
        <ul role="tablist">
          <li><a href="#site" role="tab"><i className="fa fa-database"></i></a></li>
          <li><a href="#filters" role="tab"><i className="fa fa-filter"></i></a></li>
          <li><a href="#layers" role="tab"><i className="fa fa-layer-group"></i></a></li>
          <li><a href="#draw" role="tab"><i className="fa fa-draw-polygon"></i></a></li>
          {/* Move Feedback tab to the bottom */}
        </ul>
        <ul role="tablist" style={{position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'none', border: 'none', margin: 0, padding: 0, display: 'flex', justifyContent: 'flex-end'}}>
          <li><a href="#feedback" role="tab"><i className="fa fa-envelope"></i></a></li>
        </ul>
      </div>
      <div className="leaflet-sidebar-content">
        <div className="leaflet-sidebar-pane" id="site">
          <h1 className="leaflet-sidebar-header">Data Selection<span className="leaflet-sidebar-close"></span></h1>
          <DataSelectionPanel 
            showHerostones={showHerostones}
            setShowHerostones={setShowHerostones}
            showTemples={showTemples}
            setShowTemples={setShowTemples}
            showInscriptions={showInscriptions}
            setShowInscriptions={setShowInscriptions}
            clusteringHerostones={clusteringHerostones}
            setClusteringHerostones={setClusteringHerostones}
            clusteringInscriptions={clusteringInscriptions}
            setClusteringInscriptions={setClusteringInscriptions}
            clusteringTemples={clusteringTemples}
            setClusteringTemples={setClusteringTemples}
            herostoneColor={herostoneColor}
            setHerostoneColor={setHerostoneColor}
            herostoneSize={herostoneSize}
            setHerostoneSize={setHerostoneSize}
            herostoneOpacity={herostoneOpacity}
            setHerostoneOpacity={setHerostoneOpacity}
            inscriptionColor={inscriptionColor}
            setInscriptionColor={setInscriptionColor}
            inscriptionSize={inscriptionSize}
            setInscriptionSize={setInscriptionSize}
            inscriptionOpacity={inscriptionOpacity}
            setInscriptionOpacity={setInscriptionOpacity}
            templeColor={templeColor}
            setTempleColor={setTempleColor}
            templeSize={templeSize}
            setTempleSize={setTempleSize}
            templeOpacity={templeOpacity}
            setTempleOpacity={setTempleOpacity}
          />
        </div>
        <div className="leaflet-sidebar-pane" id="filters">
          <h1 className="leaflet-sidebar-header">Filters<span className="leaflet-sidebar-close"></span></h1>
          <FiltersPanel />
        </div>
        <div className="leaflet-sidebar-pane" id="layers">
          <h1 className="leaflet-sidebar-header">Layers<span className="leaflet-sidebar-close"></span></h1>
          <LayersPanel 
            basemap={basemap}
            setBasemap={setBasemap}
            opacity={opacity}
            setOpacity={setOpacity}
          />
        </div>
        <div className="leaflet-sidebar-pane" id="draw">
          <h1 className="leaflet-sidebar-header">Spatial Filter<span className="leaflet-sidebar-close"></span></h1>
          {/* SpatialFilterPanel removed */}
        </div>
        {/* Move Feedback pane to the bottom */}
        <div className="leaflet-sidebar-pane" id="feedback">
          <h1 className="leaflet-sidebar-header">Feedback<span className="leaflet-sidebar-close"></span></h1>
          <FeedbackPanel />
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
