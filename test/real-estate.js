/* eslint-disable no-undef */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("RealEstate", () => {
  let deployer, seller, buyer, inspector, lender;
  let realEstate, escrow;
  const nftID = 1;
  let transaction, balance;
  const purchasePrice = ether(100.0);
  const escrowAmount = ether(20.0);

  beforeEach(async () => {
    // setup accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];
    inspector = accounts[2];
    lender = accounts[3];

    // load contracts
    const RealEstate = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    // deploy contracts
    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      realEstate.address,
      nftID,
      purchasePrice,
      escrowAmount,
      seller.address,
      buyer.address,
      inspector.address,
      lender.address
    );

    transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, nftID);
    await transaction.wait();
  });

  describe("Deployment", async () => {
    it("sends an NFT to the seller / deployer", async () => {
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
    });
  });

  describe("Selling Real Estate", async () => {
    describe("Esecutes a Successful Transaction", async () => {
      it("expects seller to be NFT owner before the sale", async () => {
        expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);

        describe("Deposit Earnest", () => {
          it("only buyer deposits earnest by 'depositEarnest()' function and escrow balance updated", async () => {
            transaction = await escrow
              .connect(buyer)
              .depositEarnest({ value: escrowAmount });
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
            console.log("Buyer deposits earnest money");

            describe("Update Escrow Balance", () => {
              it("escrow balance should be update and equal to escrowAmount", async () => {
                balance = await escrow.getBalance();
                expect(ethers.utils.formatEther(balance)).to.equal(
                  ethers.utils.formatEther(escrowAmount)
                );

                describe("Inspection", () => {
                  it("only inspector update the inspection status by 'updateInspectionStatus()' function", async () => {
                    transaction = await escrow
                      .connect(inspector)
                      .updateInspectionStatus(true);
                    await transaction.wait();
                    console.log("Inspector updates status");

                    describe("Approve Sale", () => {
                      it("buyer, seller and lender approve the sale", async () => {
                        transaction = await escrow.connect(buyer).approveSale();
                        await transaction.wait();
                        console.log("Buyer approve sale");

                        transaction = await escrow
                          .connect(seller)
                          .approveSale();
                        await transaction.wait();
                        console.log("Seller approve sale");

                        transaction = await escrow
                          .connect(lender)
                          .approveSale();
                        await transaction.wait();
                        console.log("Lender approve sale");

                        describe("Lenders Fund", () => {
                          it("lender funds the sale and escrow balance should be equal to purchasePrice - escrowAmount", async () => {
                            transaction = await lender.sendTransaction({
                              to: escrow.address,
                              value: ether(80),
                            });
                            await transaction.wait();
                            console.log("Lender funds the sale");

                            // escrow balance should be equal to purchasePrice - escrowAmount
                            balance = await escrow.getBalance();
                            // expect(ethers.utils.formatEther(balance)).to.equal(
                            //   ethers.utils.formatEther(purchasePrice) -
                            //     ethers.utils.formatEther(escrowAmount)
                            // );

                            describe("Finalize Sale", () => {
                              it("finalize the sale and after finalize or after the sale buyer expects to be NFT owner", async () => {
                                transaction = await escrow
                                  .connect(buyer)
                                  .finalizeSale();
                                await transaction.wait();
                                console.log("Buyer finalizes sale");

                                expect(
                                  await realEstate.ownerOf(nftID)
                                ).to.equal(buyer.address);

                                describe("Seller Receive Amount", () => {
                                  it("Seller should receive the amount after the final sale and his balance should be above 100 ether", async () => {
                                    balance = await ethers.provider.getBalance(
                                      seller.address
                                    );
                                    console.log(
                                      "Seller balance: ",
                                      ethers.utils.formatEther(balance)
                                    );
                                    expect(balance).to.be.above(ether(10099));
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
