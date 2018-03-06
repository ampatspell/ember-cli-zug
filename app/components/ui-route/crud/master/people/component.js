import Component from '../base/component';
import layout from '../base/template';

export default Component.extend({
  layout,
  classNameBindings: [ ':ui-route-crud-master-people' ],

  row: 'ui-route/crud/master/people/row',

});
