require('@openzeppelin/hardhat-upgrades');
require('@nomicfoundation/hardhat-toolbox');
require('./tasks/fundwallet');
require('dotenv').config();

module.exports = {
  solidity: '0.8.26',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    hoodi: {
      url: process.env.HOODI_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    anvil: {
      url: 'http://127.0.0.1:8545',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
