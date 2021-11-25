task("transfer-ownership", "Transfers ownership of a contract")
  .addParam("contract", "The address of the contract")
  .addParam("newOwnerAddress", "New owner wallet address")
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract;
    const newOwnerAddress = taskArgs.newOwnerAddress;
    const HackaContract = await ethers.getContractFactory("Hacka");

    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    console.log(
      `Transferring ownership of contract ${contractAddr} to ${newOwnerAddress}`
    );

    const hackaContractInstance = await new ethers.Contract(
      contractAddr,
      HackaContract.interface,
      signer
    );

    await hackaContractInstance.transferOwnership(newOwnerAddress).then((data) => {
      console.log("Response is: ", JSON.stringify(data));
    });
  });

module.exports = {};
