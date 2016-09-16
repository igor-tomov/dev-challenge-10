/**
 * App entry point
 */

// include styles
require('openlayers/dist/ol.css');
require('bootstrap/dist/css/bootstrap.css');
require('./styles/index.css');

// import the models
import {
  APP_ROOT_NODE,
  MAP_CENTER_COORDINATES,
  MAP_START_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM
} from './config';

import {Model} from 'backbone';
import RouteMapView from './views/RouteMapView';
import RoutePanelView from './views/RoutePanelView';
import {GeoCoordinateList} from './models/GeoCoordinateModel';
import geoCoordinateData from './data/kiev-metro-stations.json';



// select app-root DOM node
const appRootNode = document.getElementById(APP_ROOT_NODE);

// instantiate App models
const coordinateList = new GeoCoordinateList(geoCoordinateData);
const compositeModel = new Model;

compositeModel.set({ coordinateList });

// instantiate Route panel view
const routePanel = new RoutePanelView({
  model: coordinateList
});

// instantiate Map view
const mapView = new RouteMapView({model: compositeModel});

// rener the map
mapView.render(appRootNode, {
  mapCoord: MAP_CENTER_COORDINATES,
  zoom: MAP_START_ZOOM,
  minZoom: MAP_MIN_ZOOM,
  maxZoom: MAP_MAX_ZOOM
});
