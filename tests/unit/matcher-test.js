import module from '../helpers/module-for-firebase';
import { test } from '../helpers/qunit';
import PersistedModel from 'ember-cli-zug/model/persisted';
import { run } from '@ember/runloop';

const Duck = PersistedModel.extend();

module('matcher', {
  async beforeEach() {
    this.modelNameForDocument = () => 'duck';
    this.register('model:duck', Duck);
    this.create = opts => this.store._internal.matchersManager.createInternalMatcher(opts);
  }
});

test('create array', async function(assert) {
  let internal = this.create({ type: 'array', matches: () => true });
  assert.ok(internal);

  let model = internal.model(true);
  assert.ok(model);
  assert.ok(model.get('context') === this.store);
  assert.ok(model.get('type') === 'array');
  assert.ok(model.get('content').mapBy('doc.id'), []);

  this.store.model({ name: 'duck', path: 'ducks/yellow' });
  assert.ok(model.get('content').mapBy('doc.id'), [ 'yellow' ]);
});

test('create single', async function(assert) {
  let internal = this.create({ type: 'single', matches: () => true });
  assert.ok(internal);

  let model = internal.model(true);
  assert.ok(model);
  assert.ok(model.get('context') === this.store);
  assert.ok(model.get('type') === 'single');
  assert.ok(model.get('content') === null);

  let duck = this.store.model({ name: 'duck', path: 'ducks/yellow' });
  assert.ok(model.get('content') === duck);
});

test('destroy context', async function(assert) {
  let context = this.store.nest('foof');
  let model = context.matcher({ type: 'single', matches: () => true });
  let internal = model._internal;

  run(() => context.destroy());

  assert.ok(model.isDestroyed);
  assert.ok(internal.isDestroyed);
});

test('destroy matcher', async function(assert) {
  let internal = this.create({ type: 'single', matches: () => true });
  let model = internal.model(true);

  assert.ok(this.store._internal.matchersManager.matchers.includes(internal));

  run(() => model.destroy());

  assert.ok(model.isDestroyed);
  assert.ok(internal.isDestroyed);

  assert.ok(!this.store._internal.matchersManager.matchers.includes(internal));
});
