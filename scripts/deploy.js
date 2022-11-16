/* eslint-disable no-undef */
/* eslint-disable no-process-exit */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FlashLoan = await ethers.getContractFactory("FlashLoan");
  const FlashLoanReceiver = await ethers.getContractFactory(
    "FlashLoanReceiver"
  );
  const Token = await ethers.getContractFactory("Token");

  const token = await Token.deploy("My Token", "MTK", "1000000");
  await token.deployed();
  console.log("Tokens deployed at:", token.address);

  const flashLoan = await FlashLoan.deploy(token.address);
  await flashLoan.deployed();
  console.log("Flash loan deployed at:", flashLoan.address);

  const flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address);
  await flashLoanReceiver.deployed();
  console.log("Flash loan receiver deployed at:", flashLoanReceiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
