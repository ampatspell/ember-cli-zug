export default {
  name: 'dev',
  initialize(app) {
    app.inject('component', 'store', 'service:store');
    app.inject('route', 'store', 'service:store');
    app.inject('component', 'router', 'service:router');

    let store = app.lookup('service:store');
    let firebase = app.lookup('service:firebase');

    window.store = store;
    window.firebase = firebase;

    // let main = store.fork('main');
    // let query = main.query({
    //   id: 'all-posts',
    //   query: db => db.collection('posts').orderBy('created_at', 'asc')
    // });
    // query.load().then(arg => {
    //   console.log('loaded', arg.get('content'));
    // });

    // let ref = db.doc('posts/sU1cbdwiLm80CpUI3TlR');
    // ref.onSnapshot(snapshot => {
    //   console.log(snapshot);
    // });

    // let posts = db.collection('posts');
    // posts.orderBy('created_at', 'desc').limit(1).onSnapshot(snapshot => {
    //   console.log(snapshot);
    //   let doc = snapshot.docs[0];
    //   console.log(doc);
    // });

  }
};
