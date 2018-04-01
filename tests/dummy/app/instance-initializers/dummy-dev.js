// import firebase from 'firebase';

// const playground = async store => {
//   let app = store.get('app');
//   let auth = firebase.auth(app);

//   const dump = (message, user) => {
//     let props;
//     if(user) {
//       let { displayName, email, isAnonymous } = user;
//       props = { displayName, email, isAnonymous };
//     }
//     console.log(message, user, props);
//   };

//   let user = auth.currentUser;
//   dump('initial', user);

//   auth.onAuthStateChanged(user => {
//     dump('onAuthStateChanged', user);
//   });

//   window.auth = {
//     createUser: (email, password) => auth.createUserWithEmailAndPassword(email, password),
//     signIn: (email, password) => auth.signInWithEmailAndPassword(email, password),
//     signOut: () => auth.signOut()
//   };
// }

export default {
  name: 'dummy:dev',
  after: 'dummy:store',
  initialize(/*instance*/) {
    // let store = instance.lookup('service:store');
    // store.get('ready').then(() => playground(store)).catch(err => console.error(err.stack));
  }
};
