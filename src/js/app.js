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
    //initiate the ethereum js api, with this we are going to interact with our ethereum blockchain it can retrieve
    //user accounts send transactions interact with smart contracts and more
    //initializing web3
    if(typeof web3 !== undefined){
      App.web3Provider = web3.currentProvider; //metamask injects web3; this line of code means if there is injected web3 then we ll use it
    } else { //if there is no injected web3, then we ll follow back to our ganache
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    }
    
    web3 = new Web3(App.web3Provider) //if there is no injected web3 instance is present then we want to create a web3 object
    App.web3Provider.enable();
    //window.ethereum.enable();
    return App.initContract();
  },

  initContract: function() {
    //now that we can interact with our ethereum to web3 we need to connect to our smart contract so web3 would know where to find it and how it works
    //for this we have our truffle contract library that keeps the contract in sync with migrations so you dont need to change the contact deployed address manually
    $.getJSON("Adoption.json", function(data){ //this will read the compiled file and return it as the variable data
      var adoptionArtifact = data; //assigning variable to the data
      App.contracts.adoption = TruffleContract(adoptionArtifact) //Truufle contract function; This ll save for us to truffle contract inside the contract object on top here and it ll keep it in sync with the migrations that we do
      App.contracts.adoption.setProvider(App.web3Provider) //setting the provider
      return App.markAdopted() //calling the markAdopted function in case any pets are already adopted from our previous visit
    })
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    //this is async await code same in unit test, just the other way
    App.contracts.adoption.deployed().then(function(instance){ //getting the instance of the deployed contract 
      return instance.getAdopters.call(); //this ll give us all the adopters that we have in smart contract
    }).then(function(adopters){ //going through all the adopters
      for (let i = 0; i < adopters.length; i++) {
        if(!web3.toBigNumber(adopters[i]).isZero()){ //this ll loop through all the pets and check all the addresses for them and if the address is not zero 
        /*  $('.panel-pet').eq(i).find("button").text("Success").attr("disabled",true); //it ll disable the button and change it text to success
        }*/
        //if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(error){
      console.log(error.message)
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function(error,accounts){ //as we are going to send a transaction so we need injected web3 accounts, this ll return us the accounts the user has metamask for instance and it ll give us an error if there is one
      if(error){ //if error is present
        console.log(error)
      }
      App.contracts.adoption.deployed().then(function(instance){ //getting the instance of the deployed contract 
        return instance.adopt.sendTransaction(petId,{from : accounts[0]}) //calling adopt
      }).then(function(result){ //if the above code run succesfully we ll get a result and then step inside the code
        return App.markAdopted() //and mark the newly adopted pet
      }).catch(function(error){
        console.log(error.message)
      })
    })
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
