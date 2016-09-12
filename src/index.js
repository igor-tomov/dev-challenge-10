
import ol from 'openlayers';

new ol.Map({
  layers: [
    new ol.layer.Tile({source: new ol.source.OSM()})
  ],
  view: new ol.View({
    center: [0, 0],
    zoom: 13
  }),
  target: 'kiev-map'
});
