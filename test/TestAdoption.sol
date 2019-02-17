pragma solidity ^0.5.0;

// The following import gives us various assertions to use in our tests. Assertions check for things like equality, inequality or emptiness to return a pass/fail from our test. This is a global truffle file, not a directory.
import "truffle/Assert.sol";

// When running tests, Truffle will deploy a fresh instance of the contract being tested to the blockchain. The following import is the smart contract which gets the address of the deployed contract. This is a global truffle file, not a directory.
import "truffle/DeployedAddresses.sol";

// The following import is the smart contract that we want to test.
import "../contracts/Adoption.sol";



contract TestAdoption {

  // The address of the adoption contract to be tested
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  // The ID of the pet that will be used for testing
  uint expectedPetId = 8;

  // The expected owner of adopted pet is this contract. Since the TestAdoption contract will be sending the transaction, we set the expected adopter address to <this>, a contract-wide variable that gets the current contract's address.
  address expectedAdopter = address(this);



  // Testing the adopt() function
  function testUserCanAdoptPet() public {

    // Call the smart contract declared earlier with the ID of <expectedPetId>
    uint returnedId = adoption.adopt(expectedPetId);

    // Pass the actual value, the expected value, and a failure message to Assert.equal()
    Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");

  }



  // Testing retrieval of a single pet's owner
  function testGetAdopterAddressByPetId() public {

    // After getting the adopter address stored by the adoption contract...
    address adopter = adoption.adopters(expectedPetId);

    // ... we assert equality as done above in testUserCanAdoptPet()
    Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract.");

  }



  // Testing retrieval of all pet owners
  function testGetAdopterAddressByPetIdInArray() public {

    // Store adopters in memory rather than contract's storage. Note the memory attribute, which tells Solidity to temporarily store the value in memory, rather than saving it to the contract's storage.
    address[16] memory adopters = adoption.getAdopters();

    // Since <adopters> is an array, and we know from the first adoption test that we adopted pet <expectedPetId>, we compare the testing contract's address with location <expectedPetId> in the array.
    Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract.");
  }

}

/*
To run the tests, type the following in the terminal:

      truffle tests

If all the tests pass, you should see output like this:

      Using network 'development'.

      Compiling ./contracts/Adoption.sol...
      Compiling ./test/TestAdoption.sol...


        TestAdoption
          ✓ testUserCanAdoptPet (57ms)
          ✓ testGetAdopterAddressByPetId
          ✓ testGetAdopterAddressByPetIdInArray (72ms)


        3 passing (5s)

*/
