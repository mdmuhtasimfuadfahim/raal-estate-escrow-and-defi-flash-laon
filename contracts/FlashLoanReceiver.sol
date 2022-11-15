// SPDX-License-Identifier: Unlicense

// https://github.com/OpenZeppelin/damn-vulnerable-defi/blob/master/contracts/unstoppable/ReceiverUnstoppable.sol

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "./FlashLoan.sol";

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    event LoanReceived (
        address token,
        uint256 amount
    );

    constructor (address _poolAddress) {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }

    modifier onlyOwner () {
        require(msg.sender == owner, "Only owners can execute flash loans");
        _;
    }

    function receiveTokens(address _tokenAddress, uint256 _amount) external {
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, "Failed to get loan");
        require(msg.sender == address(pool), "Sender must be pool");

        // do stuff with the money
        emit LoanReceived(_tokenAddress, _amount);
        
        // return funds to pool
        require(Token(_tokenAddress).transfer(msg.sender, _amount), "Transfer of tokens failed");
    }

    function executeFlashLoan(uint _amount) external onlyOwner {
        pool.flashLoan(_amount);
    }
}