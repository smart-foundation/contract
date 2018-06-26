pragma solidity ^0.4.4;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract PayableToken is StandardToken, Ownable {
  using SafeMath for uint256;

  // How many token units a buyer gets per wei.
  // The rate is the conversion between wei and the smallest and indivisible token unit.
  // So, if you are using a rate of 1 with a DetailedERC20 token with 3 decimals called TOK
  // 1 wei will give you 1 unit, or 0.001 TOK.
  uint256 public rate;

  // Amount of wei raised
  uint256 public weiRaised;

  /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(
    address indexed purchaser,
    address indexed beneficiary,
    uint256 value,
    uint256 amount
  );

  /**
   * Event for exchange rate change
   * @param rate new exchange rate
   */
  event RateChange(uint256 rate);

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param _beneficiary Address performing the token purchase
   */
  function buyTokens(address _beneficiary) public payable {
    uint256 weiAmount = msg.value;

    require(_beneficiary != address(0));
    require(rate != 0x0);
    require(weiAmount != 0);

    uint256 tokens = weiAmount.mul(rate);

    weiRaised = weiRaised.add(weiAmount);
    balances[_beneficiary] = balances[_beneficiary].add(tokens);

    emit TokenPurchase(
      msg.sender,
      _beneficiary,
      weiAmount,
      tokens
    );
  }

  /**
    * @dev Set Token to Ether rate.
    * @param _rate defines TOK/ETH rate: 1 ETH = _rate TOK
    */
  function setRate(uint256 _rate) external onlyOwner {
    require(_rate != 0x0);
    rate = _rate;
    emit RateChange(_rate);
  }

}
