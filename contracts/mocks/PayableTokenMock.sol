pragma solidity ^0.4.4;

import "../PayableToken.sol";

contract PayableTokenMock is PayableToken {

  constructor(address _fundsWallet) PayableToken(_fundsWallet) public {
  }

}
