import createState from '../model/create-state';

const { keys, State } = createState({
  defaults: {
    isExisting: undefined,
    isLoaded:   false,
    isError:    false,
    error:      null
  },
  extend: BaseState => class State extends BaseState {

    onLoading(changed) {
      this.set({ isError: false, error: null }, changed);
    }

    onLoaded(changed) {
      this.set({ isLoaded: true, isExisting: true }, changed);
    }

    onMissing(changed) {
      this.set({ isLoaded: true, isExisting: false }, changed);
    }

    onMissingError(error, changed) {
      this.set({ isExisting: false, isLoaded: true, isError: true, error }, changed);
    }

    onError(error, changed) {
      this.set({ isError: true, error }, changed);
    }

  }
});

export {
  keys
};

export default State;
