module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('----------------------------------------------------');
  const Hacka = await deploy('Hacka', {
    from: deployer,
    log: true,
  });
  log(`Hacka contract deployed to ${Hacka.address}`);
};

module.exports.tags = ['all', 'hacka'];
