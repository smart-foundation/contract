pragma solidity ^0.4.4;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract EtherStorage {
  using SafeMath for uint256;
  uint256 private allowed;

  constructor() public {
  }

  function etherDeposit(uint256 amount) payable public {
    require(msg.value == amount);
  }

  function etherWithdraw(uint256 _value) public {
    require(_value <= allowed);
    require(_value <= address(this).balance);

    msg.sender.transfer(address(this).balance);
  }

  function etherIncreaseApproval(uint256 _value) internal {
    allowed = allowed.add(_value);
    emit EtherApprovalIncrease(_value);
  }

  function etherDecreaseApproval(uint256 _value) internal {
    allowed = allowed.sub(_value);
    emit EtherApprovalDecrease(_value);
  }

  event EtherApprovalIncrease(uint256 value);
  event EtherApprovalDecrease(uint256 value);
}
