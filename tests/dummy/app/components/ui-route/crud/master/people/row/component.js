import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud-master-people-row', 'selected:strong' ],
});
