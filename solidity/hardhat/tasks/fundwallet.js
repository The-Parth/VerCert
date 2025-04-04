const { task } = require("hardhat/config");
const { utils } = require("ethers");

task("fundwallet", "Send ETH to own test account")
  .addParam("to", "Address you want to fund")
  .addOptionalParam("amount", "Amount to send in ether, default 100")
  .setAction(async (taskArgs, { ethers }) => {
    let to = await ethers.utils.getAddress(taskArgs.to);
    const amount = taskArgs.amount ? taskArgs.amount : "100";
    const accounts = await ethers.provider.listAccounts();
    const fromSigner = await ethers.provider.getSigner(accounts[0]);
    const fromAddress = await fromSigner.getAddress();

    const txRequest = {
      from: fromAddress,
      to,
      value: ethers.utils.parseUnits(amount, "ether").toHexString(),
    };

    const txResponse = await fromSigner.sendTransaction(txRequest);
    await txResponse.wait();
    console.log(
      `wallet ${to} funded with ${amount} ETH at transaction ${txResponse.hash}`
    );
  });
