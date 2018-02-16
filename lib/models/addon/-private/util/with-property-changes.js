const context = (internal, skip, notify=true) => {
  let model;
  let changed;
  let properties = [];

  let push = key => {
    if(!properties.includes(key)) {
      properties.push(key);
    }
  };

  if(notify) {
    model = internal.model(false);
    if(model) {
      changed = key => {
        push(key);
        if(skip && skip.includes(key)) {
          return;
        }
        model.notifyPropertyChange(key);
      };
    }
  }

  if(!changed) {
    changed = key => push(key);
  }

  changed.properties = properties;
  return { model, changed };
};

export default (internal, notify, cb, skip) => {
  let { model, changed } = context(internal, skip, notify);

  if(model) {
    model.beginPropertyChanges();
  }

  let result = cb(changed);

  if(model) {
    model.endPropertyChanges();
  }

  return result;
};
