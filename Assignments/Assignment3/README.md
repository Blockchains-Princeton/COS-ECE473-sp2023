# Assignment 3: Minting synthetic assets

As we know, synthetic assets are created to mimic the value of other assets, but value cannot be created out of nothing. To mint some amount of sAsset, a certain amount of existing tokens (usually at a higher value) need to be collateralized. Such binding commitments are represented by collateralized debt positions (CDP).

**Collateralized debt positions (CDP)** is the position created by locking collateral to generate synthetic assets. For instance, you hold stablecoin EUSD worth $10,000. You could collateralize these tokens in a CDP to mint $5,000 worth of the sAsset sTSLA. At this point, your CDP holds $10,000 worth of EUSD as collateral and owes $5,000 worth of sTSLA.

The minted sTSLA tokens are freely tradeable to exploit the price changes. For example, to short TSLA, you can sell tokens in the DEX market and wait until the price drops, then you buy tokens back to close the position. 


The value of the collateral must exceed the value of synthetic assets to avoid debt risk. The ratio of the value of a CDP's locked collateral to the value of its current minted tokens is called **collateral ratio** (e.g. in the above example, the collateral ratio is `$10,000 / $5,000 = 2`). Each asset has a **minimum collateral ratio (MCR)** (in this project, we define `MCR=2`),  and the CDP is required to always maintain the ratio above its MCR. If the price of a synthetic asset rises resulting in a collateral ratio lower than MCR, minters of associated CDP would be pressured to deposit more collateral to maintain the MCR. Otherwise, the protocol will initiate a margin call to liquidate collateral. 

## Mint interface
In this part, you need to implement the `contracts/Mint.sol` contract which allows anyone to 

1. open a CDP by sending EUSD as collateral and mint sAsset (`openPosition`)
2. close a CDP to withdraw EUSD and burn sAsset (`closePosition`)
3. deposit EUSD to an existing CDP (`deposit`)
4. withdraw EUSD from an existing CDP (`withdraw`)
5. mint sAsset from an existing CDP (`mint`)
6. return and burn sAsset to an existing CDP (`burn`)

The interfaces of these functions are defined in `interfaces/IMint.sol`. Your task is to implement these functions in `Mint.sol` according to the specifications below. The liquidation function is not required in this project.

### Struct
There are two predefined structs. `Asset` represents information related to each sAsset such as token contract address, price feed contract address and MCR. `Position` represents an active CDP including an index, the owner of the position, the amount of the collateral tokens, and the address and the amount of the asset tokens.

### State variables
Four variables are used to record the states of the contract.

* `_assetMap` is a mapping from sAsset token address to an Asset struct, which includes all registered asset users can mint.
* `_currentPositionIndex` is an incremental integer starting from 0, whenever a new position is opened, the current index will be assigned to the position and increase by 1.
* `_idxPositionMap` is a mapping from position index to a Position struct used to store all existing positions.
* `collateralToken` is the address of the collateral token contract, in this project, we only accept one type of token (EUSD) as collateral whose address is specified in the constructor.

### Functions
There are some functions already implemented for the initial setup.

* `registerAsset` is used to register a new asset given the address of the new asset, MCR and the price feed contract address. It can only be called by the owner of the Mint contract.
* `getPosition` is a view function that returns the information about a position at the given index.
* `checkRegistered` is a view function that checks whether the input asset token is registered.

The remaining functions are left for you to implement.

* `openPosition`: Create a new position by transferring `collateralAmount` EUSD tokens from the message sender to the contract. Make sure the asset is registered and the input collateral ratio is not less than the asset MCR, then calculate the number of minted tokens to send to the message sender.
* `closePosition`: Close a position when the position owner calls this function. Burn all sAsset tokens and transfer EUSD tokens locked in the position to the message sender. Finally, delete the position at the given index.
* `deposit`: Add collateral amount of the position at the given index. Make sure the message sender owns the position and transfer deposited tokens from the sender to the contract.
* `withdraw`: Withdraw collateral tokens from the position at the given index. Make sure the message sender owns the position and the collateral ratio won't go below the MCR. Transfer withdrawn tokens from the contract to the sender.
* `mint`: Mint more asset tokens from the position at the given index. Make sure the message sender owns the position and the collateral ratio won't go below the MCR. 
* `burn`: Contract burns the given amount of asset tokens in the position. Make sure the message sender owns the position.

## Testing

We can test simple functions manually by interacting with Remix, but it is not a good idea when testing multiple contracts with composable functions. In this part, we will use [**Truffle**](https://trufflesuite.com/) to deploy and test smart contracts and [**Ganache**](https://github.com/trufflesuite/ganache) to create a local blockchain. The testing script provided in `test/test.js` is written in JavaScript.

### Start your local blockchain
We have interacted with testnet Goerli and the local blockchain provided by Remix. Now we want to run our own nodes to create a local blockchain. 

1. Install the prerequisite software:  [Node.js](https://nodejs.org/en/), and choose the LTS version (the one on the left).
2. Install ganache-cli by running `npm install -g ganache-cli`. Then, run `ganache-cli` to run a node on your local blockchain. You can stop the node at any time with Ctrl-C.

With ganache, you are able to debug in Remix: keep the ganache node running and set the environment in Remix as *Web3 Provider* with endpoint http://127.0.0.1:8545. Then for each transaction, you can click on the ''Debug'' button next to transactions in the Remix terminal and replay the function calls step by step.

### Unit testing
After finishing the contracts, you can test your implementation using Truffle.

1. Install truffle by running `npm install -g truffle`.
2. Then, `cd Assignment3` and run `npm install` to install openzeppelin packages. To better understand the directory structure you can refer to this [tutorial](https://trufflesuite.com/tutorial/).
3. Replace the `Mint.sol` contract in the `contracts` folder with your implementation. Run `truffle test`.

Note: Do not change other files in `Assignment3`, the `PriceFeed.sol` provided here is a dumb price feed implementation used for testing that only returns a constant price. 



## Submission
Rename the `Mint.sol` to `netid.sol` and submit it to [this form](https://forms.gle/wWwaWSvjjDXPwC5f8).  The grading will be conducted using truffle with more tests, including both valid and invalid operations (such as when the caller is not the owner of the position, withdrawal / mint that results in an under-collateralized CDP).

