import createState from './create-state';

const { keys, State } = createState({
  defaults: {
    isNew: true,
    isExisting: false,
    isSaving: false
  },
  extend: BaseState => class State extends BaseState {
  }
});

export {
  keys
};

export default State;
