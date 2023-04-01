// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./interfaces/IPriceFeed.sol";

contract TSLAPriceFeed is IPriceFeed {
    

    constructor(address proxy) {
    }

    function getLatestPrice() external override view returns (int, uint) {
        return (100885500000, 1650577228);
    }
}