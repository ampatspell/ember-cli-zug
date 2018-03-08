import * as functions from 'firebase-functions';
import * as express from 'express';
// import * as fastbootMiddleware from 'fastboot-express-middleware';

// let dist = './dist';

let app = express();
// app.use(express.static(dist, { index: false }));
// app.get('/*', fastbootMiddleware(dist));

// exports.fastboot = functions.https.onRequest(app);

app.get('/', (req, res) => {
  res.json({ path: '/' });
});

app.get('*', (req, res) => {
  res.json({ path: '*' });
});

exports.hello = functions.https.onRequest((req, res) => {
  if(!req.path) {
    req.url = `/${req.url}`;
  }
  return app(req, res);
});
