/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@appliedblockchain/chainlink-plugins-fund-link');

require('dotenv').config();

require('./tasks/accounts');
require('./tasks/balance');
require('./tasks/block-number');
require('./tasks/transfer-ownership');
require('./tasks/withdraw-link');

module.exports = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      {
        version: '0.6.6',
      },
      {
        version: '0.4.24',
      },
      {
        version: '0.8.7',
      },
    ],
  },
  networks: {
    kovan: {
      url: process.env.KOVAN_RPC_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000,
  },
};
