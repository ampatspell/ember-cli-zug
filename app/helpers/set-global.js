import Helper from '@ember/component/helper';

export default Helper.extend({

  _replace(hash) {
    let keys = this.get('_keys') || [];

    keys.map(key => delete window[key]);

    keys = Object.keys(hash || {});

    keys.map(key => {
      let value = hash[key];
      console.log(`window.${key} = ${value}`);
      window[key] = value;
    });

    this.set('_keys', keys);
  },

  compute(params, hash) {
    this._replace(hash);
  },

  willDestroy() {
    this._replace();
    this._super(...arguments);
  }

});
