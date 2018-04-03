# Storage API

``` javascript
let ref = storage.ref({ path: 'hello' });

// ref: isLoaded, isExisting
// ref.metadata no state info

ref.get('metadata') // => is here but _empty_

await ref.load(); // forwards to metadata.load

ref.get('metadata') // => Metadata
ref.get('metadata.serialized'); // => { ... }

await ref.get('metadata').update({ customMetadata: { ok: true }}); // Promise

ref.get('downloadURL'); // metadata.downloadURLs[0]
```
