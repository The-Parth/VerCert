// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

contract DocumentStorage is Initializable, UUPSUpgradeable {
  struct Document {
    bytes32 sha256Hash;
    string ipfsCID;
  }

  // Keep track of three owners (the deployer + two more)
  address[3] private owners;

  // Track authorized issuers and revokers
  mapping(address => bool) public authorizedIssuers;
  mapping(address => bool) public authorizedRevokers;

  // Arrays to list current authorized issuers and revokers
  address[] private issuerList;
  address[] private revokerList;

  // Maps user ID to an array of documents
  mapping(uint256 => Document[]) private _userDocuments;

  event DocumentStored(
    uint256 indexed userId,
    bytes32 sha256Hash,
    string ipfsCID
  );

  event IssuerAdded(address issuer);
  event IssuerRemoved(address issuer);
  event RevokerAdded(address revoker);
  event RevokerRemoved(address revoker);

  // constructor() {
  //     _disableInitializers();
  // }

  modifier onlyOwners() {
    require(
      msg.sender == owners[0] ||
        msg.sender == owners[1] ||
        msg.sender == owners[2],
      'Not an owner'
    );
    _;
  }

  function initialize(address _owner2, address _owner3) public initializer {
    require(msg.sender == tx.origin, 'Only the deployer can initialize');
    owners[0] = msg.sender;
    owners[1] = _owner2;
    owners[2] = _owner3;
    __UUPSUpgradeable_init();
  }

  function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyOwners
  {}

  // Owners can add/remove authorized issuers
  function addAuthorizedIssuer(address issuer) external onlyOwners {
    require(!authorizedIssuers[issuer], 'User already authorised');
    authorizedIssuers[issuer] = true;
    issuerList.push(issuer);
    emit IssuerAdded(issuer);
  }

  function removeAuthorizedIssuer(address issuer) external onlyOwners {
    require(authorizedIssuers[issuer], 'User is not authorised');
    authorizedIssuers[issuer] = false;

    // Remove the issuer from the array
    for (uint256 i = 0; i < issuerList.length; i++) {
      if (issuerList[i] == issuer) {
        issuerList[i] = issuerList[issuerList.length - 1];
        issuerList.pop();
        break;
      }
    }
    emit IssuerRemoved(issuer);
  }

  // Owners can add/remove authorized revokers
  function addAuthorizedRevoker(address revoker) external onlyOwners {
    require(!authorizedRevokers[revoker], 'User already authorised');
    authorizedRevokers[revoker] = true;
    revokerList.push(revoker);
    emit RevokerAdded(revoker);
  }

  function removeAuthorizedRevoker(address revoker) external onlyOwners {
    require(authorizedRevokers[revoker], 'User is not authorised');
    authorizedRevokers[revoker] = false;

    // Remove the revoker from the array
    for (uint256 i = 0; i < revokerList.length; i++) {
      if (revokerList[i] == revoker) {
        revokerList[i] = revokerList[revokerList.length - 1];
        revokerList.pop();
        break;
      }
    }
    emit RevokerRemoved(revoker);
  }

  // List all authorized issuers
  function getAllAuthorizedIssuers() external view returns (address[] memory) {
    return issuerList;
  }

  // List all authorized revokers
  function getAllAuthorizedRevokers() external view returns (address[] memory) {
    return revokerList;
  }

  // Store a document (allowed for owners or authorized issuers)
  function storeDocument(
    uint256 userId,
    bytes32 sha256Hash,
    string memory ipfsCID
  ) public {
    require(
      authorizedIssuers[msg.sender] ||
        msg.sender == owners[0] ||
        msg.sender == owners[1] ||
        msg.sender == owners[2],
      'Not authorized to store'
    );
    _userDocuments[userId].push(Document(sha256Hash, ipfsCID));
    emit DocumentStored(userId, sha256Hash, ipfsCID);
  }

  // Get all documents for a user (accessible by anyone)
  function getDocuments(uint256 userId)
    public
    view
    returns (bytes32[] memory, string[] memory)
  {
    Document[] storage docs = _userDocuments[userId];
    bytes32[] memory hashes = new bytes32[](docs.length);
    string[] memory cids = new string[](docs.length);
    for (uint256 i = 0; i < docs.length; i++) {
      hashes[i] = docs[i].sha256Hash;
      cids[i] = docs[i].ipfsCID;
    }
    return (hashes, cids);
  }

  // Get the number of documents for a user (accessible by anyone)
  function getDocumentCount(uint256 userId) public view returns (uint256) {
    return _userDocuments[userId].length;
  }
}
