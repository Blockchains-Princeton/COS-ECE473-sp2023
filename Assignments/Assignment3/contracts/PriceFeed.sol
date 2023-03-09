// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./interfaces/IPriceFeed.sol";

contract PriceFeed is IPriceFeed {

    /* This is a dumb price feed only used for testing*/
    

    constructor(address proxy) {
    }

    function getLatestPrice() external override view returns (int, uint) {
        return (100000000000, 1649616880);
    }
}