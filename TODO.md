# TODO

* fork context computed property should destroy context after settle
* data update from snapshot should mark doc `{ isDirty: false }`
* event for `isExisting=true|false`
* transforms for attr
* tests for query computed
* computed model
* model, array fragments
* snapshot-observer metadata
* firebase session
* firebase storage
* fastboot shoebox for models, documents, query states
* transient computed property should have `{ type: single / array }`
* `context.modelClassForNameExists(name)` -- useful for prefixing classes based on context in `modelNameForDocument`
* match computed property sorting
* queries computed property which merges multiple query states (isLoading, isError, errrors) (and additional promises?)
