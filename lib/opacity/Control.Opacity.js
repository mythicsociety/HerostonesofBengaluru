/* Minimal stub for Control.Opacity.js for demo purposes. Replace with the full plugin code for production. */
L.Control.opacitySlider = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-control-opacity-slider');
        container.style.background = '#fff';
        container.style.padding = '8px';
        container.style.marginTop = '8px';
    container.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;"><input id="opacity-slider" type="range" min="0" max="1" step="0.01" value="1" orient="vertical" style="height:78px;width:26px;margin:0 auto;display:block;"></div>';
        L.DomEvent.disableClickPropagation(container);
        return container;
    },
    setOpacityLayer: function(layer) {
        this._layer = layer;
        var slider = document.getElementById('opacity-slider');
        if (slider) {
            slider.oninput = function() {
                layer.setOpacity(parseFloat(this.value));
            };
        }
    }
});
L.control.opacitySlider = function(opts) { return new L.Control.opacitySlider(opts); };
