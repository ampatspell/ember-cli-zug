import Component from '../base/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-crud-detail-edit-person' ],

  actions: {
    toggleBlog(blog, person, selected) {
      blog.setOwner(selected ? person : null);
    }
  }

});
