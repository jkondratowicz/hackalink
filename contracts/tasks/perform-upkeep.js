task("perform-upkeep", "Emulate keepers upkeep")
  .addParam("contract", "The address of the contract")
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract;
    const HackaContract = await ethers.getContractFactory("Hacka");

    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    console.log(
      `Performing upkeep for contract ${contractAddr}`
    );

    const hackaContractInstance = await new ethers.Contract(
      contractAddr,
      HackaContract.interface,
      signer
    );

    await hackaContractInstance.performUpkeep([]).then((data) => {
      console.log("Response is: ", JSON.stringify(data));
    }).catch(console.error);
  });

module.exports = {};
