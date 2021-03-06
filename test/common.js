const chai = require('chai');

require('babel-register')({
  plugins: [ 'transform-es2015-modules-commonjs' ]
});
require('yamlify/register');

chai.use(require('chai-enzyme')());

global.testUtils = require('./testUtils');

// Mock an asset like Webpack's file-loader.
function mockAsset(modulePath) {
  const path = require.resolve(modulePath);
  require.cache[path] = {
    exports: path
  };
}

mockAsset('../assets/audio/mention.mp3');
