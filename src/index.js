/**
 * App entry point
 */

// include styles
require('openlayers/dist/ol.css');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap-select/dist/css/bootstrap-select.css');
require('./styles/index.css');

// import the models
import {
  APP_ROOT_NODE,
  MAP_CENTER_COORDINATES,
  MAP_START_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM
} from './config';

import AppMapView from './views/AppMapView';
import {GeoCoordinate, GeoCoordinateList} from './models/GeoCoordinate';
import geoCoordinateData from './data/kiev-metro-stations.json';


// select app-root DOM node
const appRootNode = document.getElementById(APP_ROOT_NODE);

const coordinateList = new GeoCoordinateList(geoCoordinateData);

// instantiate Map view
const kievMap = new AppMapView;

// rener the app
kievMap.render(appRootNode, {
  mapCoord: MAP_CENTER_COORDINATES,
  zoom: MAP_START_ZOOM,
  minZoom: MAP_MIN_ZOOM,
  maxZoom: MAP_MAX_ZOOM
});
