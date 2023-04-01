// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IMint {
    
    function registerAsset(address assetToken, uint minCollateralRatio, address priceFeed) external;

    function openPosition(uint collateralAmount, address assetToken, uint collateralRatio) external;
    function closePosition(uint positionIndex) external;

    function deposit(uint positionIndex, uint collateralAmount) external;
    function withdraw(uint positionIndex, uint withdrawAmount) external;

    function mint(uint positionIndex, uint mintAmount) external;
    function burn(uint positionIndex, uint burnAmount) external;


}
