pragma solidity ^0.5.1;

contract MattCoin {
	// State variables
	string public name = "MattCoin";
	string public symbol = "MCN";
	string public standard = "MattCoin v1.0";
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	constructor(uint256 _initialSupply) public {
		totalSupply = _initialSupply;

		// allocate initial supply
		balanceOf[msg.sender] = _initialSupply;
	}

	// Transfer
	function transfer(address _to, uint256 _value) public returns (bool success) {
		// Exception if account doesn't have enough
		require(balanceOf[msg.sender] >= _value);
		// Transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		// Transfer Event
		emit Transfer(msg.sender, _to, _value);
		// Return a boolean
		return true;
	}

}