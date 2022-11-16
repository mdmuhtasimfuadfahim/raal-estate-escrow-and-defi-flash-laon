/* eslint-disable no-unused-vars */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("FlashLoan", () => {
  let accounts;
  let deployer;
  let token, flashLoan, flashLoanReceiver;
  let transaction;

  beforeEach(async () => {
    // setup accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    // load contracts
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const FlashLoanReceiver = await ethers.getContractFactory(
      "FlashLoanReceiver"
    );
    const Token = await ethers.getContractFactory("Token");

    // deploy tokens
    token = await Token.deploy("My Token", "MTK", "1000000");

    // deploy flash loan pools
    flashLoan = await FlashLoan.deploy(token.address);

    // approve tokens before depositing
    transaction = await token
      .connect(deployer)
      .approve(flashLoan.address, tokens(1000000));
    await transaction.wait();

    // deposit tokens into the pool
    transaction = await flashLoan
      .connect(deployer)
      .depositTokens(tokens(1000000));
    await transaction.wait();

    // deploy flash loan receiver
    flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address);
  });

  describe("Deployment", () => {
    it("sends tokens to flash loan pool contract", async () => {
      expect(await token.balanceOf(flashLoan.address)).to.equal(
        tokens(1000000)
      );
    });
  });

  describe("Borrowing Funds", () => {
    it("borrows funds from the pool", async () => {
      const amount = tokens(100);
      const transaction = await flashLoanReceiver
        .connect(deployer)
        .executeFlashLoan(amount);
      await transaction.wait();

      await expect(transaction)
        .to.emit(flashLoanReceiver, "LoanReceived")
        .withArgs(token.address, amount);
    });
  });
});
