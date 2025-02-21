// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InteractionLogger {

    // Event to log interactions with sender address and timestamp
    event InteractionLogged(address indexed sender, uint256 timestamp);

    // Function to log the interaction with the current sender's address and timestamp
    function logInteraction() public {
        emit InteractionLogged(msg.sender, block.timestamp);
    }
}
