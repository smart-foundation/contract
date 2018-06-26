'use strict';

const BigNumber = web3.BigNumber;

const SmartFundToken = artifacts.require('SmartFundTokenMock');

import EVMRevert from './helpers/EVMRevert';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('SmartFundToken', accounts => {

    beforeEach(async function () {
        this.contract = await SmartFundToken.new();
        await this.contract.setRate(new BigNumber(1));
    });

    it('has fallback', async function () {
        await web3.eth.sendTransaction({
            from: accounts[1],
            to: this.contract.address,
            value: web3.toWei(1, 'ether')
        });
    });
});
