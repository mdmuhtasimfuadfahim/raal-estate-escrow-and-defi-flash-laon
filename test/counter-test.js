const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", () => {
  let counter;
  beforeEach(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy(1, "My Counter");
  });

  describe("Deployment", () => {
    it("sets the initial count", async () => {
      //   const count = await counter.count();
      expect(await counter.count()).to.equal(1);
    });

    it("sets the initial name", async () => {
      //   const name = await counter.name();
      expect(await counter.name()).to.equal("My Counter");
    });
  });

  describe("Counting", () => {
    let transaction;

    it("reads the count from the 'getCount()' function", async () => {
      expect(await counter.getCount()).to.equal(1);
    });

    it("reads the count from the 'count' public variable", async () => {
      expect(await counter.count()).to.equal(1);
    });

    it("increments the count", async () => {
      transaction = await counter.incrementCount();
      await transaction.wait();
      expect(await counter.count()).to.equal(2);
    });

    it("decrements the count", async () => {
      transaction = await counter.decrementCount();
      await transaction.wait();
      expect(await counter.count()).to.equal(0);

      // cannot decrement the count below 0
      await expect(counter.decrementCount()).to.be.reverted;
    });
  });

  describe("Naming", () => {
    let transaction;

    it("reads the name from the 'getName()' function", async () => {
      expect(await counter.getName()).to.equal("My Counter");
    });

    it("reads the name from the 'name' public variable", async () => {
      expect(await counter.name()).to.equal("My Counter");
    });

    it("updates the name", async () => {
      transaction = await counter.setName("My Count Contract");
      await transaction.wait();
      expect(await counter.name()).to.equal("My Count Contract");
    });
  });
});
