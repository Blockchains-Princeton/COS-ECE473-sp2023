// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./interfaces/IPriceFeed.sol";

contract BNBPriceFeed is IPriceFeed {
    

    constructor(address proxy) {
    }

    function getLatestPrice() external override view returns (int, uint) {
        return (40760000000, 1650578108);
    }
}