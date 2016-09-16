import {View} from 'backbone';



export default View.extend({

  el: '#panel-route',

  events: {
    'change': '_onSelecboxChange',
    'click #find-route': '_onSearch',
    'click #reset-route': '_onReset',
  },

  initialize({ model }) {
    this.listenTo(model, 'change:selected', this._onItemSelected);
    this.fillSelectboxes();
  },


  /**
   * Fill selectboxes with current model state
   */
  fillSelectboxes() {
    this.$el
        .find('.station-selectbox')
        .empty()
        .append(this._buildSelectboxItems())
        .prop("selectedIndex", -1);
  },



  triggerRouteSearch() {
    // filter selected items
    const selectedItems = this.model.filter(
      item => item.get('selected') && !! item.get('order')
    );

    // trigger "route search" in case of 2 selected items ('from' and 'to')
    if (selectedItems.length === 2) {
      this.model.trigger(
        'route:search',
        selectedItems.sort((a, b) => {
          if (a.get('order') > b.get('order')) {
            return 1;
          }

          if (a.get('order') === b.get('order')) {
            return 0;
          }

          if (a.get('order') < b.get('order')) {
            return -1;
          }
        })
      );
    }
  },



  /**
   * Reset selection state
   */
  reset() {
    // reset model state selection
    this.model.each(item => {
      if (item.get('selected')) {
        item.set({
          selected: false,
          order: 0
        });
      }
    });

    // reset selectbox selection
    this.fillSelectboxes();
  },



  /**
   * Build option items from model collection
   * @param {Funcion} filter - apply filtration to model collection
   * @return {DocumentFragment}
   */
  _buildSelectboxItems(filter) {
    let model = this.model;

    if (filter){
      model = model.filter(filter);
    }

    return model.reduce((fragment, item, i) => {
      let option = document.createElement('option');

      option.value      = item.get('label');
      option.innerText  = item.get('label');

      fragment.appendChild(option);

      return fragment;
    }, document.createDocumentFragment());
  },



  _onSelecboxChange(event) {
    const {target} = event;

    this.model.selectItem(target.value, +target.dataset.order);
  },


  /**
   * Coordinate item has been updated on the model side
   * @param {GeoCoordinateModel} coordItem
   */
  _onItemSelected(coordItem) {
    const order       = coordItem.get('order');
    const $selectBox  = this.$el.find(`.station-selectbox[data-order='${order === 1 ? 2 : 1}']`);
    const lastValue   = $selectBox.val();

    $selectBox
        .empty()
        .append(this._buildSelectboxItems(item => item.get('order') !== order));

    if (lastValue) {
      $selectBox
          .find(`option[value='${lastValue}']`)
          .prop('selected', true);
    } else {
      $selectBox.prop("selectedIndex", -1);
    }
  },



  _onSearch() {
    this.triggerRouteSearch();
  },



  _onReset() {
    this.reset();
  }
});
