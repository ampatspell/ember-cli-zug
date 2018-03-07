# TODO

* fork context computed property should destroy context after settle
* data update from snapshot should mark doc `{ isDirty: false }`
* transforms for attr
* tests for query computed
* model, array fragments
* expose snapshot-observer metadata
* firebase session
* firebase storage
* fastboot shoebox for models, documents, query states
* transient computed property should have `{ type: single / array }`
* `context.modelClassForNameExists(name)` -- useful for prefixing classes based on context in `modelNameForDocument`
* match computed property sorting
* queries computed property which merges multiple query states (isLoading, isError, errrors) (and additional promises?)
