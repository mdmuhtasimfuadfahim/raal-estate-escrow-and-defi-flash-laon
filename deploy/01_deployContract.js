/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unpublished-require */
const { network } = require("hardhat");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const RealEstate = await deploy("RealEstate", {
    from: deployer,
    log: true,
  });

  const Escrow = await deploy("Escrow", {
    from: deployer,
    log: true,
    args: [
      RealEstate.address,
      1,
      ethers.utils.parseUnits("10", "gwei"),
      ethers.utils.parseUnits("2", "gwei"),
      "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
      "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
      "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
      "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    ],
  });
};

module.exports.tags = ["RealEstate", "escrow"];
