import createState from './create-state';

const { keys, State } = createState({
  defaults: {
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
      this.set({ isLoading: false, isLoaded: true }, changed);
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
