/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unpublished-require */
const { network } = require("hardhat");
const { ethers } = require("hardhat");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;
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
  });
};

module.exports.tags = ["RealEstate", "escrow"];
