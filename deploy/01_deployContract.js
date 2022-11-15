/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unpublished-require */
const { network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const Token = await deploy("Token", {
    from: deployer,
    log: true,
  });

  const FlashLoan = await deploy("FlashLoan", {
    from: deployer,
    log: true,
  });

  const FlashLoanReceiver = await deploy("FlashLoanReceiver", {
    from: deployer,
    log: true,
  });
};

module.exports.tags = ["MTK", "FL", "FLR"];
