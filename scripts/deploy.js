/* eslint-disable no-process-exit */
const hre = require("hardhat");
const { ethers } = require("hardhat");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

async function main() {
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const Escrow = await hre.ethers.getContractFactory("Escrow");

  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();
  console.log("Real Estate deployed to:", realEstate.address);

  const escrow = await Escrow.deploy(
    realEstate.address,
    1,
    ether(10),
    ether(2),
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d"
  );

  await escrow.deployed();

  console.log("Escrow deployed to:", escrow.address);
}

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
})();
