pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "./sAsset.sol";

contract sTSLA is sAsset {
    
    constructor(uint256 initialSupply) sAsset('synthetic TSLA', 'sTSLA', initialSupply) {
    }
}