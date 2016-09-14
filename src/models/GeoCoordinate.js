import {Model, Collection} from 'backbone';



export const GeoCoordinate = Model.extend({
  defaults: () => ({
    label: '',
    address: '',
    location: {
      lat: null,
      lng: null
    },
    selected: false
  })
});



export const GeoCoordinateList = Collection.extend({
  model: GeoCoordinate,

  initialize() {
    this.on('change:selected', this._onRefresh);
  },

  unselectedItems() {
    return this.filter(coord => ! coord.selected)
  },

  selectedItems() {
    return this.filter(coord => coord.selected)
  },

  _onRefresh() {
    this.trigger('refresh', this.selectedItems());
  }
})
