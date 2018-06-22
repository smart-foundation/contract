pragma solidity ^0.4.4;

import "../EtherStorage.sol";

contract EtherStorageMock is EtherStorage {

  function etherApprove(uint256 _value) public {
    etherIncreaseApproval(_value);
  }

}
