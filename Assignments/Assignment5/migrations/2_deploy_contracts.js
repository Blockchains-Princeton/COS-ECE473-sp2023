var sBNB = artifacts.require("./sBNB.sol");
var sTSLA = artifacts.require("./sTSLA.sol");
var Swap = artifacts.require("./Swap.sol");

var EUSD = artifacts.require("./EUSD.sol");
var Mint = artifacts.require("./Mint.sol");
var TSLAPriceFeed = artifacts.require("./TSLAPriceFeed.sol");
var BNBPriceFeed = artifacts.require("./BNBPriceFeed.sol");




module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(EUSD);
    await deployer.deploy(Mint, EUSD.address);
    await deployer.deploy(TSLAPriceFeed, "0xb31357d152638fd1ae0853d24b9Ea81dF29E3EF2");
    await deployer.deploy(BNBPriceFeed, "0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16");

    await deployer.deploy(sBNB, 2000000);
    await deployer.deploy(sTSLA, 2000000);
    await deployer.deploy(Swap, sBNB.address, sTSLA.address);
};

