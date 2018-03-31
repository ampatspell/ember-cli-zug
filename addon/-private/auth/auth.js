import EmberObject from '@ember/object';
import { InternalMixin, modelprop, invoke } from '../model/internal';

export default EmberObject.extend(InternalMixin, {

  methods: modelprop(),

  user: modelprop(),

  signOut: invoke('signOut')

});
