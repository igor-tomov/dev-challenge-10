import {View} from 'backbone';
import ol from 'openlayers';


/**
 * Represents Map container
 */
export default class KievMapView extends View {

  constructor(){
    super({
      className: "kiev-map"
    })
  }



  render(mountNode){
    mountNode.appendChild(this.el);

    this.mapView = new ol.Map({
      target: this.el,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    });

    return this;
  }
}
