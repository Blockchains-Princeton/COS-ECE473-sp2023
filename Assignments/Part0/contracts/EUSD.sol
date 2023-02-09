pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract EUSD is ERC20 {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() ERC20("Ethereum USD", "EUSD") {
        _mint(msg.sender, 100000000 * (10 ** uint256(decimals())));
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
}

