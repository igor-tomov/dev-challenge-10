import KievMapView from './views/KievMapView';

const appRootNode = document.getElementById('app-root');
const kievMap = new KievMapView;

kievMap.render(appRootNode);
