import createState from '../model/create-state';

const { keys, State } = createState({
  defaults: {
    isExisting: undefined,
    isLoading:  false,
    isLoaded:   false,
    isError:    false,
    error:      null
  },
  extend: BaseState => class State extends BaseState {

    onLoading(changed) {
      this.set({ isLoading: true, isError: false, error: null }, changed);
    }

    onLoaded(changed) {
      this.set({ isLoading: false, isLoaded: true, isExisting: true }, changed);
    }

    onMissing(changed) {
      this.set({ isLoading: false, isLoaded: true, isExisting: false }, changed);
    }

    onMissingError(error, changed) {
      this.set({ isLoading: false, isExisting: false, isLoaded: true, isError: true, error }, changed);
    }

    onError(error, changed) {
      this.set({ isLoading: false, isError: true, error }, changed);
    }

  }
});

export {
  keys
};

export default State;
