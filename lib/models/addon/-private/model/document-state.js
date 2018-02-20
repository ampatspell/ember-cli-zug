import createState from './create-state';

const recompute = {};

const { keys, State } = createState({
  defaults: {
    isExisting: undefined,
    isDirty:    true,
    isLoaded:   true,
    isLoading:  false,
    isSaving:   false,
    isError:    false,
    error:      null
  },
  computed: [
    'isNew',
  ],
  extend: BaseState => class State extends BaseState {

    get isNew() {
      return this.owner.isNew;
    }

    onCreated(changed) {
      this.set({ isDirty: false, isSaving: false, isNew: recompute, isExisting: true }, changed);
    }

    onLoaded(isExisting, changed) {
      this.set({ isDirty: false, isLoading: false, isLoaded: true, isExisting }, changed);
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
