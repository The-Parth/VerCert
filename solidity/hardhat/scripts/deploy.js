const { ethers, upgrades } = require('hardhat');

// run with npx hardhat run scripts/deploy.js --network localhost
// or npx hardhat run scripts/deploy.js --network hoodi

async function main() {
  const DocumentStorage = await ethers.getContractFactory('DocumentStorage');

  const contract = await upgrades.deployProxy(
    DocumentStorage,
    [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '0xCeCf7Dc2dFF66cb4C990F6db4f2C59f5A94D0bB9',
    ],
    {
      initializer: 'initialize',
    }
  );

  await contract.waitForDeployment();
  console.log('DocumentStorage deployed to:', await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
