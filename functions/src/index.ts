import * as functions from 'firebase-functions';

export const ping = functions.https.onRequest((req, res) => {
  res.json({ ok: true, app: 'ember-cli-zug' });
});
