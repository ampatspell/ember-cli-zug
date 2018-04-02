// const playground = async store => {
//
//   await store.get('auth.methods.anonymous').signIn();
//
//   let storage = store._internal.storage.storage;
//
//   // let load = async () => {
//   //   let ref = storage.ref('hello.txt');
//   //   let url = await ref.getDownloadURL();
//   //   console.log(url);
//   //   let metadata = await ref.getMetadata();
//   //   console.log(metadata);
//   // }
//
// }

export default {
  name: 'dummy:dev',
  after: 'dummy:store',
  initialize(/*instance*/) {
    // let store = instance.lookup('service:store');
    // store.get('ready').then(() => playground(store));
  }
};
