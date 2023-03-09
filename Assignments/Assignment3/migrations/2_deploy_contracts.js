var EUSD = artifacts.require("./EUSD.sol");
var sAsset = artifacts.require("./sAsset.sol");
var Mint = artifacts.require("./Mint.sol");
var PriceFeed = artifacts.require("./PriceFeed.sol");



module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(sAsset, 'synthetic TSLA', 'sTSLA', 0);
    await deployer.deploy(EUSD);
    await deployer.deploy(Mint, EUSD.address);
    await deployer.deploy(PriceFeed, "0xb31357d152638fd1ae0853d24b9Ea81dF29E3EF2");
};

