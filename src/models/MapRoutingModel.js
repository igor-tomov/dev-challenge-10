import {Model} from 'backbone';



export default Model.extend({
  defaults: () => ({
    endpoint: null,
    data: null
  }),

  search(coordStart, coordEnd) {
    const endpoint = this.get('endpoint');

    const bbox = {
      left: coordStart.lng < coordEnd.lng ? coordStart.lng : coordEnd.lng,
      bottom: coordStart.lat < coordEnd.lat ? coordStart.lat : coordEnd.lat,
      right: coordStart.lng > coordEnd.lng ? coordStart.lng : coordEnd.lng,
      top: coordStart.lat > coordEnd.lat ? coordStart.lat : coordEnd.lat
    }

    this.trigger('route:fetch:start');

    fetch(`${endpoint}/map?place=kiev&oneway=yes&highway=*&bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}`)
      .then(response => response.text().then( text => ({ response, text })))
      .then(({response, text}) => {
        if (! response.ok) {
          return Promise.reject(text);
        }

        this.set({
          data: this._parseOSMRespose(text)
        });
      })
      .catch(err => {
        console.error(err);
        this.set({
          data: null
        });
      });
  },



  _parseOSMRespose(text) {
    const parser = new DOMParser;
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    return Array.prototype.reduce.call(xmlDoc.querySelectorAll('[changeset]'), (payload, node) => {
      const [lng, lat] = [+node.getAttribute('lon'), +node.getAttribute('lat')];
      const cacheKey = lng.toString() + lat.toString();

      if (! payload.cache[cacheKey]) {
        payload.cache[cacheKey] = true;
        payload.res.push({ lng, lat });
      }

      return payload;
    }, {
      cache: {}, // cache unique values
      res: []
    }).res;
  }
});
