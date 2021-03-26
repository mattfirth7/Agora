pragma solidity ^0.5.1;

contract MattCoin {
	uint256 public totalSupply;

	// Constructor
	// Set total number of tokens
	// Read total number of tokens
	constructor() public {
		totalSupply = 1000000;
	}
}