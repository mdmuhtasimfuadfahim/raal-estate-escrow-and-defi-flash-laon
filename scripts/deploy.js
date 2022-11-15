/* eslint-disable no-undef */
/* eslint-disable no-process-exit */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
  const FlashLoanReceiver = await hre.ethers.getContractFactory(
    "FlashLoanReceiver"
  );
  const Token = await hre.ethers.getContractFactory("Token");

  const token = await Token.deploy("My Tokens", "MTKs", "1000000");
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const flashLoan = await FlashLoan.deploy(token.address);
  await flashLoan.deployed();
  console.log("Flash Loan deployed to:", flashLoan.address);

  const flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address);
  await flashLoanReceiver.deployed();
  console.log("Flash Loan Receiver deployed to:", flashLoanReceiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
