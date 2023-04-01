// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ISwap {

    function init(uint token0Amount, uint token1Amount) external;

    function addLiquidity(uint token0Amount) external;
    function removeLiquidity(uint withdrawShares) external;

    function token0To1(uint token0Amount) external;
    function token1To0(uint token1Amount) external;
 

    

    
}