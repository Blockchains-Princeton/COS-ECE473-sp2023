var contracts = {}
const contracts_to_deploy = ['sBNB', 'sTSLA', 'Swap']
for (name of contracts_to_deploy) {
    contracts[name] = artifacts.require(name)
}

contract("Swap test", async accounts => {
    
    it("Running setup", async () => {
        var instances = {};
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed();
        }

        const amount = 500000 * 10 ** 8;
        const tokens = await instances['Swap'].getTokens.call();
        assert.equal(tokens[0], instances['sBNB'].address);
        assert.equal(tokens[1], instances['sTSLA'].address);
        
        await instances['sBNB'].approve(instances['Swap'].address, amount);
        await instances['sTSLA'].approve(instances['Swap'].address, amount);
        await instances['Swap'].init(amount, amount);
        
    });
    it("Checking setup", async () => {
        var instances = {}
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed()
        }

        const amount = 500000 * 10 ** 8;
        const reserves = await instances['Swap'].getReserves.call();
        assert.equal(reserves[0], amount);
        assert.equal(reserves[1], amount);

        const shares = await instances['Swap'].getShares.call(accounts[0]);
        assert.equal(shares, amount);

    });

    it("Test 1: test addLiquidity", async () => {
        var instances = {}
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed()
        }
        const amount = 500000 * 10 ** 8;
        await instances['sBNB'].approve(instances['Swap'].address, amount);
        await instances['sTSLA'].approve(instances['Swap'].address, amount);
        await instances['Swap'].addLiquidity(amount);

        const reserves = await instances['Swap'].getReserves.call();
        assert.equal(reserves[0], amount * 2);
        assert.equal(reserves[1], amount * 2);

        const shares = await instances['Swap'].getShares.call(accounts[0]);
        assert.equal(shares, amount * 2);
        
    });

    it("Test 2: test token0To1", async () => {
        var instances = {}
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed()
        }

        const tokenSent = 1000 * 10 ** 8;
        await instances['sBNB'].transfer(accounts[1], tokenSent);
        await instances['sBNB'].approve(instances['Swap'].address, tokenSent, { from: accounts[1] });
        await instances['Swap'].token0To1(tokenSent, { from: accounts[1] });

        const tokenReceived = await instances['sTSLA'].balanceOf.call(accounts[1]);

        assert(Math.abs(tokenReceived - 99600698103) < 100);
        const reserves = await instances['Swap'].getReserves.call();
        assert.equal(reserves[0], 1000000 * 10 ** 8 + tokenSent);
        assert.equal(reserves[1], 1000000 * 10 ** 8 - tokenReceived);

    });

    it("Test 3: test token1To0", async () => {
        var instances = {}
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed()
        }

        const reserves_before = await instances['Swap'].getReserves.call();

        const tokenSent = 1000 * 10 ** 8;
        await instances['sTSLA'].transfer(accounts[2], tokenSent);
        await instances['sTSLA'].approve(instances['Swap'].address, tokenSent, { from: accounts[2] });
        await instances['Swap'].token1To0(tokenSent, { from: accounts[2] });

        const tokenReceived = await instances['sBNB'].balanceOf.call(accounts[2]);
        assert(Math.abs(tokenReceived - 99799600897) < 100);
        const reserves = await instances['Swap'].getReserves.call();
        assert(reserves[0].eq(reserves_before[0].sub(tokenReceived)));
        assert.equal(reserves[1], reserves_before[1].toNumber() + tokenSent);
        
    });

    it("Test 4: test removeLiquidity", async () => {
        var instances = {}
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed()
        }

        const reserves = await instances['Swap'].getReserves.call();

        const balance0 = await instances['sBNB'].balanceOf.call(accounts[0]);
        const balance1 = await instances['sTSLA'].balanceOf.call(accounts[0]);
        const shares = await instances['Swap'].getShares.call(accounts[0]);

        await instances['Swap'].removeLiquidity(shares);
        
        const new_reserves = await instances['Swap'].getReserves.call();
        assert.equal(new_reserves[0], 0);
        assert.equal(new_reserves[1], 0);

        const new_balance0 = await instances['sBNB'].balanceOf.call(accounts[0]);
        const new_balance1 = await instances['sTSLA'].balanceOf.call(accounts[0]);
        
        assert(new_balance0.eq(balance0.add(reserves[0])));
        assert(new_balance1.eq(balance1.add(reserves[1])));

        const new_shares = await instances['Swap'].getShares.call(accounts[0]);
        assert.equal(new_shares, 0);
        
    });

    it("Test 5: test invalid removeLiquidity", async () => {
        var instances = {}
        for (name of contracts_to_deploy) {
            instances[name] = await contracts[name].deployed()
        }

        const shares = await instances['Swap'].getShares.call(accounts[0]);
        assert.equal(shares, 0);

        var error = false;
        try {
            assert.throws(await instances['Swap'].removeLiquidity(shares + 1));           
        } catch (err) {
            error = true;
        }
        assert(error);

    });

});