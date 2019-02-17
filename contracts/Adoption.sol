pragma solidity ^0.5.0;
// The minimum version of Solidity required. Caret symbol means "the version indicated or higher"



contract Adoption {

  // Defining a single variable called <adopters>. This is an array of Ethereum addresses. Arrays can be either fixed or variable, and they contain one type. Here, the type is <adddress> and the length is <16>. Notice also that this array is <public>. Also note that array getters return only a single value from a given key.

  address[16] public adopters;



  // Allowing users to make adoption requests via the following function. This function takes in a petId (an integer) and returns an integer which should be the given petId.

  function adopt(uint petId) public returns (uint) {

    // Making sure that petId is in the range of the adopters array, which is limited to 16 members.
    require(petId >= 0 && petId <= 15);

    // If the petId is within the required range, then add the address that made the call to the adopters array
    adopters[petId] = msg.sender;

    // As a confirmation, return the petId
    return petId;

  }


  // Write a function that returns the entire <adopters> array. We need to do this because, as mentioned above, array getters only return a single value from a given key. If we don't do this, we'd have to make 16 separate API calls in order to update all of the pet adoption statuses (not efficient).

  // Note that the return type is specified as <memory>. <memory> gives the data location for the variable.
  // Note that <view> keyword means that the function will not modify the state of the contract.
  function getAdopters() public view returns (address[16] memory) {

    return adopters;

  }

}


/*
After writing the above smart contract, your next steps are to compile and migrate it.

Compiling. Translating our human-readable Solidity into something the Ethereum Virtual Machine (EVM) understands, which is bytecode.

To compile, go to the terminal, make sure you are in the root directory that contains the dapp and type:

      truffle compile

If successful, your output should look like:

      Compiling ./contracts/Migrations.sol...
      Compiling ./contracts/Adoption.sol...
      Writing artifacts to ./build/contracts

Artifacts. What are the "artifacts" that were just written? Artifacts consist of the following info related to the contract:

      ABI
      Binary of contract
      Other related info

Migration. After compiling, migration moves the contract to the blockchain. A migration is a deployment script that's meant to alter the state of your dapp's contracts, moving it from one state to the next. For example, your first migration might just be deploying new code. But over time, other migrations might move data around or replace a contract with a new one.

See the file named 2_deploy_contracts.js in your migrations/ directory.

*/
