# Part 1: Creating price feeds

To reflect the value of other assets, we need to first obtain price feeds before minting synthetic assets. While everyone can get the latest price of a stock on NASDAQ and put it on the chain, data consumers may not want to trust any single data provider.

**Data oracles** provide a decentralized and trustworthy way for blockchains to access external data sources. Resources external to the blockchain are considered "off-chain" while data stored on the blockchain is considered on-chain. Oracle is an additional piece of infrastructure to bridge the two environments.

In this part, we will use one of the most popular oracle solutions, [Chainlink](https://docs.chain.link/), to create price feeds for our synthetic tokens.



## Price feed interface
We have provided the interface of the price feed smart contract in `interfaces/IPriceFeed.sol`, you need to implement your `PriceFeed.sol` and deploy one instance for each synthetic asset to provide their prices with respect to USD. You can refer to [this tutorial](https://docs.chain.link/docs/get-the-latest-price/) for help. The proxy addresses of each asset in Goerli are provided below:

```
TSLA / USD: 0x982B232303af1EFfB49939b81AD6866B2E4eeD0B
BNB / USD: 0x7b219F57a8e9C7303204Af681e9fA69d17ef626f
```
1. There is only one function defined in the interface, you are required to implement it to provide the requested information. You can design other parts of the contract as you like.
2. Deploy the price feed contract for each asset, test the interface and copy their addresses. Once the deployment transactions are confirmed, you are able to find the deployed contracts in [etherscan](https://goerli.etherscan.io/) with https://goerli.etherscan.io/address/{:your_contract_address}.

## Submission
Submit the addresses of two contracts (20 bytes value with 0x appended in front) in this form: [https://forms.gle/zxA9zrKZSybxPqzP8](https://forms.gle/zxA9zrKZSybxPqzP8). Once the contracts are deployed, you can copy the address from Remix - Deployed Contracts.
