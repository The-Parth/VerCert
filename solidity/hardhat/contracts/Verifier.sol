// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Verifier {
    address public owner;

    // Event to log email submissions
    event EmailSubmitted(address indexed sender, string email);

    // Mapping to store email verification statuses
    mapping(string => bool) private verifiedEmails;

    constructor() {
        owner = msg.sender;
    }

    // Function to debit at least 0.01 ETH and take an email ID as input
    function submitEmail(string memory email) public payable {
        require(msg.value >= 0.01 ether, "Must send at least 0.01 ETH");
        verifiedEmails[email] = true; // Mark email as verified
        emit EmailSubmitted(msg.sender, email);
    }

    // Function to check if an email exists and is verified
    function isEmailVerified(string memory email) public view returns (bool) {
        return verifiedEmails[email];
    }

    // Function to withdraw all funds to the owner's address
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to accept ETH
    fallback() external payable {}

    // Receive function to accept ETH
    receive() external payable {}
}
