// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISwap.sol";
import "./sAsset.sol";

contract Swap is Ownable, ISwap {

    address token0;
    address token1;
    uint reserve0;
    uint reserve1;
    mapping (address => uint) shares;
    uint public totalShares;

    constructor(address addr0, address addr1) {
        token0 = addr0;
        token1 = addr1;
    }

    function init(uint token0Amount, uint token1Amount) external override onlyOwner {
        require(reserve0 == 0 && reserve1 == 0, "init - already has liquidity");
        require(token0Amount > 0 && token1Amount > 0, "init - both tokens are needed");
        
        require(sAsset(token0).transferFrom(msg.sender, address(this), token0Amount));
        require(sAsset(token1).transferFrom(msg.sender, address(this), token1Amount));
        reserve0 = token0Amount;
        reserve1 = token1Amount;
        totalShares = sqrt(token0Amount * token1Amount);
        shares[msg.sender] = totalShares;
    }

    // https://github.com/Uniswap/v2-core/blob/v1.0.1/contracts/libraries/Math.sol
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    function getReserves() external view returns (uint, uint) {
        return (reserve0, reserve1);
    }

    function getTokens() external view returns (address, address) {
        return (token0, token1);
    }

    function getShares(address LP) external view returns (uint) {
        return shares[LP];
    }
    /* TODO: implement your functions here */
    function addLiquidity(uint token0Amount) external {

        // calculate token1 amount s.t the ratio of deposits relative to reserves is the same
        uint token1Amount = reserve1 * token0Amount / reserve0;

        // transfer the number of tokens for both sAssets to the pool
        require(sAsset(token0).transferFrom(msg.sender, address(this), token0Amount));
        require(sAsset(token1).transferFrom(msg.sender, address(this), token1Amount));
        reserve0 += token0Amount;
        reserve1 += token1Amount;

        // update total shares (using geometric mean of amounts deposited) and provider's share count
        totalShares += sqrt(token0Amount * token1Amount);
        shares[msg.sender] += (totalShares * token0Amount / reserve0);
    }

    function removeLiquidity(uint withdrawShares) external {

        // calculate token amounts to be withdrawn relative to current reserve ratio
        // which should equal the share ratio of shares to be withdrawn
        uint token0Amount = reserve0 * withdrawShares / totalShares;
        uint token1Amount = reserve1 * withdrawShares / totalShares;

        // check that liquidity provider has this liquidity to remove
        require(shares[msg.sender] >= withdrawShares);

        // transfer the number of tokens for both sAssets back to the provider
        require(sAsset(token0).transfer(msg.sender, token0Amount));
        require(sAsset(token1).transfer(msg.sender, token1Amount));
        reserve0 -= token0Amount;
        reserve1 -= token1Amount;

        // update total shares (using shares withdrawn) and provider's share count
        // Q : withdrawShares should be the geometric mean of the amounts withdrawn right? sqrt(wt0 * wt1)
        totalShares -= withdrawShares;
        shares[msg.sender] -= withdrawShares;

    }

    function token0To1(uint token0Amount) external {

        uint invariant = reserve0 * reserve1;

        // apply fee on token0Amount and determine token0 to actually exchange
        uint protocol_fee = token0Amount * 3 / 1000;
        uint token0_to_exchange = token0Amount - protocol_fee;

        // use invariant and token0Amount to determine token1 to return to trader
        uint token1_to_return = reserve1 - (invariant / (reserve0 + token0_to_exchange));

        // now exchange funds with trader
        require(sAsset(token0).transferFrom(msg.sender, address(this), token0Amount));
        require(sAsset(token1).transfer(msg.sender, token1_to_return));

        // protocol fee functions as a payout to shareholders
        // the tokens charged as fees generate no new shares so when shareholders withdraw
        // they will receive a proportional payout in fees depending on the shares they own/liquidity provided
        reserve0 += token0Amount;
        reserve1 -= token1_to_return;
    }

    function token1To0(uint token1Amount) external {

        uint invariant = reserve0 * reserve1;

        // apply fee on token1Amount and determine token1 to actually exchange
        uint protocol_fee = token1Amount * 3 / 1000;
        uint token1_to_exchange = token1Amount - protocol_fee;

        // use invariant and token1Amount to determine token0 to return to trader
        uint token0_to_return = reserve0 - (invariant / (reserve1 + token1_to_exchange));

        // now exchange funds with trader
        require(sAsset(token0).transfer(msg.sender, token0_to_return));
        require(sAsset(token1).transferFrom(msg.sender, address(this), token1Amount));

        // same as before, the amount of token1 withheld as fees don't generate new shares in the pool
        // when providers withdraw, they will receive a proportional payout in fees depending on the
        // liquidity they provided (shares they own)
        reserve0 -= token0_to_return;
        reserve1 += token1Amount;
    }


    
}
