const { Buffer } = require('buffer');
const { env, log } = require('gulp-util');
const explain = require('explain-error');
const emojione = require('u-wave-web-emojione');
const ytSource = require('u-wave-source-youtube');
const scSource = require('u-wave-source-soundcloud');
const recaptchaTestKeys = require('recaptcha-test-keys');
const express = require('express');
const config = require('./dev-server-config.json');

function tryRequire(file, message) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const mod = require(file);
    return mod.default || mod;
  } catch (e) {
    throw explain(e, message);
  }
}

/**
 * üWave API development server.
 */
function devServer() {
  const port = env.port || 6042;
  const watch = env.watch || false;

  require('babel-register');
  const uwave = tryRequire('u-wave-core/src/index.js',
    'Could not find the u-wave core module. Did you run `npm install u-wave-core`?'
  );
  const createWebApi = tryRequire('u-wave-api-v1/src/index.js',
    'Could not find the u-wave API module. Did you run `npm install u-wave-api-v1`?'
  );

  const uw = uwave(config);

  uw.on('mongoError', (err) => {
    throw explain(err, 'Could not connect to MongoDB. Is it installed and running?');
  });

  uw.on('redisError', (err) => {
    throw explain(err, 'Could not connect to the Redis server. Is it installed and running?');
  });

  uw.source('youtube', ytSource, config.sources.youtube);
  uw.source('soundcloud', scSource, config.sources.soundcloud);

  const app = express();
  const server = app.listen(port);

  const apiUrl = '/v1';

  app.use(apiUrl, createWebApi(uw, {
    recaptcha: { secret: recaptchaTestKeys.secret },
    server,
    secret: Buffer.from('none', 'utf8')
  }));

  return app;
}

devServer();
