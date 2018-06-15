'use strict';

const BigNumber = web3.BigNumber;

const PayableToken = artifacts.require('PayableTokenMock');

import EVMRevert from './helpers/EVMRevert';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('PayableToken', accounts => {

    beforeEach(async function () {
        this.token = await PayableToken.new(accounts[0]);
        await this.token.setRate(new BigNumber(1));
    });

    it('exchanges tokens for ether', async function () {
        const tokenOwner = accounts[0];
        const contributor = accounts[1];

        const balanceBefore = await this.token.balanceOf(contributor);
        balanceBefore.should.be.bignumber.equal(0);

        await web3.eth.sendTransaction({
            from: contributor,
            to: this.token.address,
            value: web3.toWei(1, 'ether')
        });

        const balanceAfter = await this.token.balanceOf(contributor);
        balanceAfter.should.be.bignumber.equal(10 ** 18);
    });

    it('allows to change rate to owner only', async function () {
        await this.token.setRate.call(new BigNumber(1), {from: accounts[1]}).should.be.rejectedWith(EVMRevert);
    });

});
