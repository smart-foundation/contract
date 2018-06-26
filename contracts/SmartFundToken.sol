pragma solidity ^0.4.4;

import "./EtherStorage.sol";
import "./PayableToken.sol";

contract SmartFundToken is PayableToken, EtherStorage {

  function() external payable {
    etherDeposit(msg.value);
    buyTokens(msg.sender);
  }

}
