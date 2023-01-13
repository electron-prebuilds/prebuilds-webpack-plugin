const webpack = require('webpack');

function getElectronAbi() {
  const result = require('child_process').spawnSync(require('electron'), ['--abi'], { encoding : 'utf8' });

  return result.stdout.trim();
}

class PrebuildsPlugin extends webpack.DefinePlugin {
  constructor(options) {
    options = options || {};
    options.mode = options.mode || 'node';

    const prebuildType = process.platform === 'darwin' ? 'darwin-x64+arm64' : (process.platform + '-' + process.arch);

    const abiVersion = options.mode === 'electron' ? getElectronAbi() : require('node-abi').getAbi(process.version, 'node');
    const abiType = options.mode + '.abi' + abiVersion;

    super({
      'process.__ep_webpack': 'true',
      'process.__ep_prebuild_napi': JSON.stringify(prebuildType + '/node.napi.node'),
      'process.__ep_prebuild_abi': JSON.stringify(prebuildType + '/' + abiType + '.node'),
    });
  }
}

module.exports = PrebuildsPlugin;
module.exports.default = PrebuildsPlugin;
