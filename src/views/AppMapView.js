import {View} from 'backbone';
import ol from 'openlayers';


/**
 * Represents Map container
 */
export default class AppMapView extends View {

  constructor(){
    super({
      className: "kiev-map"
    })
  }



  render(mountNode, options){
    const element = this.el;

    // mount view element into DOM
    mountNode.appendChild(element);

    // Declare a Tile layer with an OSM source
    var osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    // Create latitude and longitude and convert them to default projection
    var coord = ol.proj.transform(options.mapCoord, 'EPSG:4326', 'EPSG:3857');

    // Create a View, set it center and zoom level
    var view = new ol.View({
      center: coord,
      zoom: options.zoom,
      minZoom: options.minZoom,
      maxZoom: options.maxZoom
    });

    // Instanciate a Map, set the object target to the map DOM id
    var map = new ol.Map({
      target: element
    });

    // Add the created layer to the Map
    map.addLayer(osmLayer);

    // Set the view for the map
    map.setView(view);

    return this;
  }
}
