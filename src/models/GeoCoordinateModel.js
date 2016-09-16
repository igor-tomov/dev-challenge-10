import {Model, Collection} from 'backbone';



export const GeoCoordinateModel = Model.extend({
  defaults: () => ({
    label: '',
    address: '',
    location: {
      lat: null,
      lng: null
    },
    selected: false,
    order: 0 // 1 - the beginning of route, 2 - the end of route
  })
});



export const GeoCoordinateList = Collection.extend({
  model: GeoCoordinateModel,

  unselectedItems(order = 0) {
    return this.filter(item => ! item.selected && item.order === order)
  },



  selectedItems() {
    return this.filter(item => item.selected)
  },



  selectItem(label, order) {
    const prevSelected = this.find(item => item.get('order') === order);

    if (prevSelected) {
      prevSelected.set({
        selected: false,
        order: 0
      }, { silent: true });
    }

    const target = this.find(item => item.get('label') === label);

    if (target){
      target.set({
        selected: true,
        order
      });
    }
  }
})
