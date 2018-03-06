import Collection from './collection';

export default Collection.extend({

  title: 'Blogs',

  collection: 'blogs',
  order: 'title',
  model: 'blog',

});
