import firebase from 'firebase';

const playground = async store => {

  await store.get('auth.methods.anonymous').signIn();

  let storage = store._internal.storage.storage;

  // storage has
  //  ref(path) => default bucket, Reference
  //  refFromURL(url) => reference with bucket, Reference

  // * StorageReference

  let upload = file => {
    let ref = storage.ref('hello.txt');
    console.log(ref);

    // let abs = storage.refFromURL('gs://foo/bar');
    // console.log(abs);

    let task;

    if(file) {
      task = ref.put(file, {
        contentType: file.type,
        customMetadata: { filename: file.name }
      });
    } else {
      task = ref.putString('hello world', firebase.storage.StringFormat.RAW, {
        contentType: 'text/plain',
        customMetadata: { ok: true }
      });
    }

    // task is thenable

    const dump = (name, snapshot) => {
      let { downloadURL, metadata, state, bytesTransferred, totalBytes } = snapshot;
      let percent = bytesTransferred / totalBytes * 100;
      console.log(name, `${percent}%`, state, metadata, downloadURL);
    };

    dump('initial', task.snapshot);

    let cancel = task.on(firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        dump('state changed', snapshot);
      },
      err => {
        console.log('onError', err);
        cancel();
      },
      complete => {
        console.log('done');
        cancel();
      }
    );
  };

  let load = async () => {
    let ref = storage.ref('hello.txt');
    let url = await ref.getDownloadURL();
    console.log(url);
    let metadata = await ref.getMetadata();
    console.log(metadata);

    // updateMetadata
    // child => ref
  }

  window.storage = { upload, load };

}

export default {
  name: 'dummy:dev',
  after: 'dummy:store',
  initialize(instance) {
    let store = instance.lookup('service:store');
    store.get('ready').then(() => playground(store));
  }
};
