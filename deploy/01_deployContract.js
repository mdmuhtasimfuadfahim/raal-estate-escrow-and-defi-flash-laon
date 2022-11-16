/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unpublished-require */
const { network } = require("hardhat");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const Token = await deploy("Token", {
    from: deployer,
    log: true,
    args: ["My Token", "MTK", "1000000"],
  });

  const FlashLoan = await deploy("FlashLoan", {
    from: deployer,
    log: true,
    args: [Token.address],
  });

  const FlashLoanReceiver = await deploy("FlashLoanReceiver", {
    from: deployer,
    log: true,
    args: [Token.address],
  });
};

module.exports.tags = ["Token", "FlashLoan", "FlashLoanReceiver"];
