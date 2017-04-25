import * as path from 'path';
import * as defaultFs from 'fs';
import trumpet from 'trumpet';
import router from 'router';
import serveStatic from 'serve-static';
import etag from 'etag';
import concat from 'concat-stream';
import fresh from 'fresh';

function injectConfig(config) {
  const transform = trumpet();
  transform.select('#u-wave-config')
    .createWriteStream()
    .end(JSON.stringify(config));
  return transform;
}

function sendString(req, res, contents) {
  res.setHeader('etag', etag(contents));

  if (fresh(req.headers, { etag: res.getHeader('etag') })) {
    res.statusCode = 304;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/html');
    res.setHeader('content-length', contents.length);
    res.end(contents);
  }
}

export default function uwaveWebClient(uw, options = {}) {
  const {
    basePath = path.join(__dirname, '../public'),
    fs = defaultFs, // Should only be used by the dev server.
    ...clientOptions
  } = options;

  const clientRouter = router();

  const indexPath = path.join(basePath, 'index.html');
  return clientRouter
    .get('/', (req, res, next) => {
      res.setHeader('cache-control', 'public, max-age=0');

      fs.createReadStream(indexPath, 'utf8')
        .pipe(injectConfig(clientOptions))
        .on('error', next)
        .pipe(concat(sendString.bind(null, req, res)));
    })
    .use(serveStatic(basePath));
}
