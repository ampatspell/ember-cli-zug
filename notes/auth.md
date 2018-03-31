# Auth

``` javascript
let auth = context.get('auth');
let user = auth.get('user');

let method = auth.get('method.email');
user = await method.signUp(email, password);
user = await method.signIn()

let method = auth.get('method.google');
let provider = method.provider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.signInWithPopup();
provider.signInWithRedirect(); // context.ready should handle this
```

```
rootContext
  auth
    user
    methods
      email
      google
      ...
    signOut()
```
