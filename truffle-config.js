const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config() //dotenv ll start the environment specific variables from the env file to process dotenv

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby : {
      provider : () => new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/"+process.env.INFURA_API_KEY),
      network_id : 4
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/"+process.env.INFURA_API_KEY),
      network_id: '3',
    },
    develop: {
      port: 8545
    }
  }
};
