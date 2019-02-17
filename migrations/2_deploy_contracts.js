var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};

/*
To migrate, you need to start up Ganache and have it running.

Then, go into the terminal and run the following:

      truffle migrate

If successful, your output should look something like:

      Starting migrations...
      ======================
      > Network name:    'development'
      > Network id:      5777
      > Block gas limit: 6721975


      1_initial_migration.js
      ======================

         Deploying 'Migrations'
         ----------------------
         > transaction hash:    0x4512060d2e40f55a26c9191b373dd1cd2ecb3c51c36d4f80e3dbb85381d53507
         > Blocks: 0            Seconds: 0
         > contract address:    0x932A6CE30600157537E4Caffd203278c4D098dD6
         > account:             0xDa9688156a521B1570B7C86a6d5F582c293b984c
         > balance:             99.98214464
         > gas used:            284908
         > gas price:           20 gwei
         > value sent:          0 ETH
         > total cost:          0.00569816 ETH


         > Saving migration to chain.
         > Saving artifacts
         -------------------------------------
         > Total cost:          0.00569816 ETH


      2_deploy_contracts.js
      =====================

         Deploying 'Adoption'
         --------------------
         > transaction hash:    0x811cdae38fe53d5b27a028057ee1c0732ba86762af7c08f70f4fcc2a195ecbc6
         > Blocks: 0            Seconds: 0
         > contract address:    0x2e75C6Ead9908DCe54C5d5118766e7642148258C
         > account:             0xDa9688156a521B1570B7C86a6d5F582c293b984c
         > balance:             99.97622628
         > gas used:            253884
         > gas price:           20 gwei
         > value sent:          0 ETH
         > total cost:          0.00507768 ETH


         > Saving migration to chain.
         > Saving artifacts
         -------------------------------------
         > Total cost:          0.00507768 ETH


      Summary
      =======
      > Total deployments:   2
      > Final cost:          0.01077584 ETH


When you go look at Ganache, you should see that the state of the blockchain has changed. It will show the "current block" (in upper left) as being up by 4. The first account is also lower in ether, due to the transaction costs of migration.


After succesful migration, you will need to TEST your smart contract. Refer to the file named TestAdoption.sol in the test/ directory.

*/
