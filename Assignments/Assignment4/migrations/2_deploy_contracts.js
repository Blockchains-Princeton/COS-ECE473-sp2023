var sBNB = artifacts.require("./sBNB.sol");
var sTSLA = artifacts.require("./sTSLA.sol");
var Swap = artifacts.require("./Swap.sol");



module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(sBNB, 2000000);
    await deployer.deploy(sTSLA, 2000000);
    await deployer.deploy(Swap, sBNB.address, sTSLA.address);
};

