pragma solidity ^0.5.1;

contract MattCoin {
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;


	constructor(uint256 _initialSupply) public {
		totalSupply = _initialSupply;

		// allocate initial supply
		balanceOf[msg.sender] = _initialSupply;
	}
}