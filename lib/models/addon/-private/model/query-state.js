import createState from './create-state';

const recompute = {};

const { keys, State } = createState({
  defaults: {
    isLoading:  true,
    isLoaded:   false,
    isError:    false,
    error:      null
  },
  extend: BaseState => class State extends BaseState {

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
