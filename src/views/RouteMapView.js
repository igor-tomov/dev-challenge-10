import {View} from 'backbone';
import ol from 'openlayers';

const MARKER_SRC = require('../assets/metro-station-icon-small.png');
const SELECTED_MARKER_SRC = require('../assets/metro-station-icon-small-selected.png');


/**
 * Represents Map container
 */
export default View.extend({

  className: "kiev-map",

  initialize() {
    const coordinateList = this.model.get('coordinateList');
    this.listenTo(coordinateList, 'change:selected', this._onSelectMarkers);
    this.listenTo(coordinateList, 'route:search', this._onSearchRoute);
    this.listenTo(this.model.get('mapRoutingModel'), 'change:data', this._onRouteDataChange);
  },



  /**
   * Build marker list according to an appropriate model
   */
  _buildMarkerLayer() {
    const vectorSource = this.model.get('coordinateList').reduce((result, coordItem) => {
      const {label, location: {lat, lng}} = coordItem.toJSON();

      let iconFeature = new ol.Feature({
        name: label,
        geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
      });

      result.addFeature(iconFeature);

      return result;
    }, new ol.source.Vector);

    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
        //anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.9,
        src: MARKER_SRC
      })
    });

    return new ol.layer.Vector({
      source: vectorSource,
      style: iconStyle
    });
  },


  /**
   * select map markers on UI accoiding to current Coordinate Model state
   */
  selectMarkers() {
    const coordList = this.model.get('coordinateList');

    this.mapControl.getLayers().item(1).getSource().getFeatures().forEach((feature, i) => {
      const coordItem = coordList.at(i);

      if (coordItem.get('selected')) {
        feature.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: SELECTED_MARKER_SRC
          })
        }));
      } else if (feature.getStyle() !== null) {
        feature.setStyle(null);
      }
    });
  },



  renderRoutes(data) {
    const {mapControl} = this;
    const mapLayers = mapControl.getLayers();

    // remove previous route layer
    if (mapLayers.length > 2) {
      mapControl.removeLayer(mapLayers.item(2));
    }

    // just finish the render in case of invalid data
    if (! data || ! Array.isArray(data)) {
      return;
    }

    const coordList = data.map(
      item => ol.proj.transform([item.lng, item.lat], 'EPSG:4326',   'EPSG:3857')
    );

    const polygon       = new ol.geom.Polygon([coordList]);
    const feature       = new ol.Feature({ geometry: polygon });
    const vectorSource  = new ol.source.Vector({ features: [feature] });
    const vectorLayer   = new ol.layer.Vector({ source: vectorSource });

    /*const coordList = data.map(item =>
      ol.proj.transform([data.lng, data.lat], 'EPSG:4326',   'EPSG:3857')
    );

    const layerLines = new ol.layer.Vector({
      source: new ol.source.Vector({
          features: [new ol.Feature({
              geometry: new ol.geom.LineString(coordList, 'XY'),
              name: 'Line'
          })]
      })
    });*/

    mapControl.addLayer(vectorLayer);
  },



  /**
   * Render the map container
   * @param {HTMLElement} mountNode - map DOM-container
   * @param {Object} options - map specific options
   */
  render(mountNode, options){
    const element = this.el;

    // mount view element into DOM
    mountNode.appendChild(element);

    // Instanciate a Map, set the object target to the map DOM id
    this.mapControl = new ol.Map({
      target: element,

      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        this._buildMarkerLayer()
      ],

      view: new ol.View({
        center: ol.proj.transform(options.mapCoord, 'EPSG:4326', 'EPSG:3857'),
        zoom: options.zoom,
        minZoom: options.minZoom,
        maxZoom: options.maxZoom
      })
    });

    return this;
  },



  _onSelectMarkers() {
    this.selectMarkers();
  },



  _onSearchRoute(coordItems) {
    const [coordStart, coordEnd] = coordItems.map(item => item.get('location'));

    this.model.get('mapRoutingModel').search(coordStart, coordEnd);
  },



  _onRouteDataChange(model) {
    this.renderRoutes(model.get('data'));
  }
});
