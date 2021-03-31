pragma solidity ^0.5.1;

contract MattCoin {
	// State variables
	string public name = "MattCoin";
	string public symbol = "MCN";
	string public standard = "MattCoin v1.0";
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);

	// transfer

	// allowance

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

	// Approve
	function approve(address _spender, uint256 _value) public returns (bool success) {
		// Require approver to have sufficient tokens
		require(balanceOf[msg.sender] >= _value);
		// allowance
		allowance[msg.sender][_spender] = _value;

		// Approve event
		emit Approval(msg.sender, _spender, _value);

		return true;
	}

	// transferFrom
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {	
		// Require _from has enough tokens
		require(balanceOf[_from] >= _value);

		// Require allowance is big enough
		require(allowance[_from][msg.sender] >= _value);

		// Change the balance
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;

		// Update the allowance
		allowance[_from][msg.sender] -= _value;

		// Transfer event
		emit Transfer(_from, _to, _value);

		// return a boolean
		return true;
	}

}