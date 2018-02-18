import createState from './create-state';

const { keys, State } = createState({
  defaults: {
    isNew:      true,
    isExisting: false,
    isDirty:    false,
    isSaving:   false,
    isError:    false,
    error:      null
  },
  extend: BaseState => class State extends BaseState {
  }
});

export {
  keys
};

export default State;
