//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract Adoption {
  address[16] public adopters; //only 16 pets are defined in our json file so only 16 adopters
  //when we define public variable we ll get an getter however in case of array the getter needs a key and it ll
  //return only one value
  
  function getAdopters() public view returns(address[16] memory) { //to get the list of adopters
    return adopters;
  }
  function adopt(uint petId) public returns(uint) { //to adopt a pet using its pet id
    require(petId>=0 && petId<=15); //checking wether the petId is within the boundaries
    adopters[petId] = msg.sender; //set the adopters address to adopters array, petId is index
    return petId;
  }

}
