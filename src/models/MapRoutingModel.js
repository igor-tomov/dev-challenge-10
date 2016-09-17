import {Model} from 'backbone';



export default Model.extend({
  defaults: {
    endpoint: null
  },

  search(coordStart, coordEnd) {
    const endpoint = this.get('endpoint');

    const bbox = {
      left: coordStart.lng < coordEnd.lng ? coordStart.lng : coordEnd.lng,
      bottom: coordStart.lat < coordEnd.lat ? coordStart.lat : coordEnd.lat,
      right: coordStart.lng > coordEnd.lng ? coordStart.lng : coordEnd.lng,
      top: coordStart.lat > coordEnd.lat ? coordStart.lat : coordEnd.lat
    }

    fetch(`${endpoint}/map?place=kiev&oneway=yes&highway=*&bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}`)
      .then(response => response.text().then( text => ({ response, text })))
      .then(({response, text}) => {
        if (! response.ok) {
          return Promise.reject(text);
        }

        const parser = new DOMParser;
        window._osm = parser.parseFromString(text, 'text/xml');
      })
      .catch(err => console.error(err));
  }
});
