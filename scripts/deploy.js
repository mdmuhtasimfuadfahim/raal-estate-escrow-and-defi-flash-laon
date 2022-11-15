/* eslint-disable no-undef */
/* eslint-disable no-process-exit */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const RealEstate = await ethers.getContractFactory("RealEstate");
  const Escrow = await ethers.getContractFactory("Escrow");

  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();
  console.log("Real Estate deployed at:", realEstate.address);

  const escrow = await Escrow.deploy(
    realEstate.address,
    1,
    ethers.utils.parseUnits("10", "gwei"),
    ethers.utils.parseUnits("2", "gwei"),
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d",
    "0xb9884b3aB614E60ED29f6d803b85255c8D46b91d"
  );
  await escrow.deployed();
  console.log("Escrow deployed at:", escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
