// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;
contract DocumentStorage {
    struct Document {
        bytes32 sha256Hash;
        string ipfsCID;
    }
    // Maps user ID to an array of documents
    mapping(uint256 => Document[]) private _userDocuments;
    event DocumentStored(
        uint256 indexed userId,
        bytes32 sha256Hash,
        string ipfsCID
    );
    // Store a document for a user
    function storeDocument(
        uint256 userId,
        bytes32 sha256Hash,
        string memory ipfsCID
    ) public {
        _userDocuments[userId].push(Document(sha256Hash, ipfsCID));
        emit DocumentStored(userId, sha256Hash, ipfsCID);
    }
    // Get all documents for a user
    function getDocuments(
        uint256 userId
    ) public view returns (bytes32[] memory, string[] memory) {
        Document[] storage docs = _userDocuments[userId];
        bytes32[] memory hashes = new bytes32[](docs.length);
        string[] memory cids = new string[](docs.length);
        for (uint256 i = 0; i < docs.length; i++) {
            hashes[i] = docs[i].sha256Hash;
            cids[i] = docs[i].ipfsCID;
        }
        return (hashes, cids);
    }
    // Get the number of documents for a user
    function getDocumentCount(uint256 userId) public view returns (uint256) {
        return _userDocuments[userId].length;
    }
}
