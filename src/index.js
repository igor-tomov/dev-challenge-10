/**
 * App entry point
 */
import {
  APP_ROOT_NODE,
  MAP_CENTER_COORDINATES,
  MAP_START_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM
} from './config';

import AppMapView from './views/AppMapView';



// select app-root DOM node
const appRootNode = document.getElementById(APP_ROOT_NODE);

// instantiate Map view
const kievMap = new AppMapView;

// rener the app
kievMap.render(appRootNode, {
  mapCoord: MAP_CENTER_COORDINATES,
  zoom: MAP_START_ZOOM,
  minZoom: MAP_MIN_ZOOM,
  maxZoom: MAP_MAX_ZOOM
});
