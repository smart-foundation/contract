'use strict';

const BigNumber = web3.BigNumber;

const EtherStorage = artifacts.require('EtherStorageMock');

import EVMRevert from './helpers/EVMRevert';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('EtherStorage', accounts => {

    beforeEach(async function () {
        this.contract = await EtherStorage.new();
    });

    it('accepts ether', async function () {
        const balanceBefore = await web3.eth.getBalance(this.contract.address);
        balanceBefore.should.be.bignumber.equal(0);

        const depositAmount = web3.toWei(1, 'ether');
        await this.contract.etherDeposit.sendTransaction(depositAmount, {
            from: accounts[0],
            to: this.contract.address,
            value: web3.toWei(1, 'ether')
        });

        const balanceAfter = await web3.eth.getBalance(this.contract.address);
        balanceAfter.should.be.bignumber.equal(10 ** 18);
    });

    it('checks deposit amount', async function () {
        const depositAmount = 0;
        await this.contract.etherDeposit.sendTransaction(depositAmount, {
            from: accounts[0],
            to: this.contract.address,
            value: web3.toWei(1, 'ether')
        }).should.be.rejectedWith(EVMRevert);
    });

    it('allows to withdraw', async function () {
        const depositAmount = web3.toWei(1, 'ether');
        await this.contract.etherDeposit.sendTransaction(depositAmount, {
            from: accounts[0],
            to: this.contract.address,
            value: web3.toWei(1, 'ether')
        });
        await this.contract.etherApprove.sendTransaction(depositAmount, {
            from: accounts[0],
            to: this.contract.address,
        });

        const balanceBefore = await web3.eth.getBalance(accounts[0]);
        const hash = await this.contract.etherWithdraw.sendTransaction(depositAmount, {
            from: accounts[0],
            to: this.contract.address,
        });
        const balanceAfter = await web3.eth.getBalance(accounts[0]);
        const txn = await web3.eth.getTransaction(hash);
        const receipt = await web3.eth.getTransactionReceipt(hash);
        const fee = txn['gasPrice'].mul(receipt['gasUsed']);

        balanceAfter.add(fee).sub(balanceBefore).should.be.bignumber.equal(depositAmount);
    });
});
