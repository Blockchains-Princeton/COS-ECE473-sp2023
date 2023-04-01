//var HDWalletProvider = require("@truffle/hdwallet-provider");
//const MNEMONIC = 'practice dawn lamp foot pumpkin blame imitate atom robot culture ride toss';
//const MNEMONIC = 'reunion want impose fat program burden soap picnic fringe wood enter myself';
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  /*
  ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/b242a89f988c41fdb40a6d3ebf724334")
      },
      network_id: 3,
      gas: 8000000,      //make sure this gas allocation isn't over 4M, which is the max
      gasPrice: 40000000000,
    },
  kovan: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://kovan.infura.io/v3/fd7fd90847cd4ca99ce886d4bffdccf8")
      },
      network_id: 42,
      gas: 8000000,      //make sure this gas allocation isn't over 4M, which is the max
      gasPrice: 40000000000,
    }
  },*/
  
  compilers: {
    solc: {
      version: '0.8.7'
    }
  }
};
