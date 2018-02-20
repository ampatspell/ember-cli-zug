import createState from './create-state';

const recompute = {};

const { keys, State } = createState({
  defaults: {
    isDirty:    true,
    isSaving:   false,
    isError:    false,
    error:      null
  },
  computed: [
    'isNew',
    'isExisting'
  ],
  extend: BaseState => class State extends BaseState {

    get isNew() {
      return this.owner.isNew;
    }

    get isExisting() {
      return this.owner.isExisting;
    }

    onCreated(changed) {
      this.set({ isDirty: false, isSaving: false, isNew: recompute, isExisting: recompute }, changed);
    }

    onLoaded(changed) {
      this.set({ isDirty: false, isExisting: recompute }, changed);
    }

    onSaved(changed) {
      this.set({ isDirty: false, isSaving: false, isExisting: recompute }, changed);
    }

  }
});

export {
  keys
};

export default State;
