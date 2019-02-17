App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },


  initWeb3: async function() {
    // Modern dapp browsers. First check if we are using modern dapp browsers or the more recent versions of MetaMask where an <ethereum> provider is injected into the <window> object. If so, we use it to create our web3 object, but we also need to explicitly request access to the accounts with ethereum.enable()
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers. If the <ethereum> object does not exist, we then check for an injected <web3> instance. If it exists, this indicates that we are using an older dapp browser (like Mist or an older version of MetaMask). If so, we get its provider and use it to create our web3 object.
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache. We create our web3 object based on our local provider. Note that this fallback is fine for development environments, but it's insecure and not suitable for production.
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },


  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {

    // Declare the variable <adoptionInstance> outside of the smart contract calls, so we can access the instance after initially retrieving it.
    var adoptionInstance;

    // Access the deployed <Adoption> contract, then call getAdopters() on that instance
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      // Using call() allows us to read data from the blockchain without having to send a full transaction, meaning we won't have to spend any ether.
      return adoptionInstance.getAdopters.call();

    }).then(function(adopters) {
      // After calling getAdopters(), loop through all of them, checking to see if an address is stored for each pet. Since the array contains address types, Ethereum initializes the array with 16 empty addresses. This is why we check for an empty address string rather than null or other falsey value.
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          // Once a <petId> with a corresponding address is found, we disable its adopt button and change the button text to "Success", so the user gets some feedback.
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      // Any errors get logged to the console.
      console.log(err.message);
    });
  },


  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    // Use web3 to get the user's accounts. In the callback after an error check, we then select the first account.
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      // From there, we get the deployed contract as we did above and store the instance in <adoptionInstance>. However, this time, instead of sending a call, we are sending a transaction. Transactions require a "from" address and have an associated cost. This cost, paid in ether, is called gas. The gas cost is the fee for performing computation and/or storing data in a smart contract.
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // We send the transaction by executing the adopt() function with both the pet's ID and an object that contains the account address, which we stored earlier in <account>.
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {

        // The result of sending a transaction is the transaction object. If there are no errors, we proceed to call our markAdopted() function to sync the UI with our newly stored data.
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};




$(function() {
  $(window).load(function() {
    App.init();
  });
});
