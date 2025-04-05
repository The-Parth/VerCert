// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';

contract DocumentStorage is
  Initializable,
  UUPSUpgradeable,
  ReentrancyGuardUpgradeable
{
  struct Document {
    bytes32 sha256Hash; // Hash of the file/content
    string docId; // String identifier (e.g., your Azure storage reference)
    uint256 issueDate; // Timestamp of when the document was issued
  }

  address[3] private owners;

  // Authorized issuers and revokers using index-based tracking (gas optimized)
  mapping(address => uint256) private issuerIndex;
  address[] private issuerList;

  mapping(address => uint256) private revokerIndex;
  address[] private revokerList;

  // Mapping from userId (string) => docId (string) => Document
  mapping(string => mapping(string => Document)) private _userDocuments;
  // Keep track of all docIds for a given userId for easy enumeration
  mapping(string => string[]) private _userDocIds;

  event DocumentStored(string indexed userId, bytes32 sha256Hash, string docId);
  event DocumentRevoked(
    string indexed userId,
    bytes32 sha256Hash,
    string docId
  );

  event IssuerAdded(address indexed issuer);
  event IssuerRemoved(address indexed issuer);
  event RevokerAdded(address indexed revoker);
  event RevokerRemoved(address indexed revoker);

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
    __ReentrancyGuard_init();
  }

  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwners {}

  // Add authorized issuer (optimized)
  function addAuthorizedIssuer(address issuer) external onlyOwners {
    require(
      issuerIndex[issuer] == 0 &&
        (issuerList.length == 0 || issuerList[0] != issuer),
      'User already authorized'
    );
    issuerIndex[issuer] = issuerList.length + 1; // Store index (1-based)
    issuerList.push(issuer);
    emit IssuerAdded(issuer);
  }

  // Remove authorized issuer (optimized)
  function removeAuthorizedIssuer(address issuer) external onlyOwners {
    require(issuerIndex[issuer] > 0, 'User is not authorized');

    uint256 index = issuerIndex[issuer] - 1; // Convert to 0-based
    uint256 lastIndex = issuerList.length - 1;

    if (index != lastIndex) {
      issuerList[index] = issuerList[lastIndex];
      issuerIndex[issuerList[index]] = index + 1; // Update swapped index
    }

    issuerList.pop();
    delete issuerIndex[issuer];
    emit IssuerRemoved(issuer);
  }

  // Add authorized revoker (optimized)
  function addAuthorizedRevoker(address revoker) external onlyOwners {
    require(
      revokerIndex[revoker] == 0 &&
        (revokerList.length == 0 || revokerList[0] != revoker),
      'User already authorized'
    );
    revokerIndex[revoker] = revokerList.length + 1;
    revokerList.push(revoker);
    emit RevokerAdded(revoker);
  }

  // Remove authorized revoker (optimized)
  function removeAuthorizedRevoker(address revoker) external onlyOwners {
    require(revokerIndex[revoker] > 0, 'User is not authorized');

    uint256 index = revokerIndex[revoker] - 1;
    uint256 lastIndex = revokerList.length - 1;

    if (index != lastIndex) {
      revokerList[index] = revokerList[lastIndex];
      revokerIndex[revokerList[index]] = index + 1;
    }

    revokerList.pop();
    delete revokerIndex[revoker];
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

  // Store a document (owners or authorized issuers only)
  function storeDocument(
    string calldata userId,
    string calldata docId,
    bytes32 sha256Hash
  ) external nonReentrant {
    require(
      issuerIndex[msg.sender] > 0 ||
        msg.sender == owners[0] ||
        msg.sender == owners[1] ||
        msg.sender == owners[2],
      'Not authorized to store'
    );

    // Ensure this document is not already stored
    Document storage existing = _userDocuments[userId][docId];
    require(existing.sha256Hash == 0, 'Document already stored');

    _userDocuments[userId][docId] = Document(sha256Hash, docId, block.timestamp);
    // Add the document ID to the user's list of documents
    _userDocIds[userId].push(docId);

    emit DocumentStored(userId, sha256Hash, docId);
  }

  mapping(string => mapping(string => bool)) private _revokedDocuments;

  function revokeDocument(
    string calldata userId,
    string calldata docId
  ) external nonReentrant {
    require(
      revokerIndex[msg.sender] > 0 ||
        msg.sender == owners[0] ||
        msg.sender == owners[1] ||
        msg.sender == owners[2],
      'Not authorized to revoke'
    );

    Document storage doc = _userDocuments[userId][docId];
    require(doc.sha256Hash != 0, 'Document not found');

    emit DocumentRevoked(userId, doc.sha256Hash, doc.docId);
    _revokedDocuments[userId][docId] = true; // Mark as revoked
    delete _userDocuments[userId][docId];

    // Remove the docId from the user's list
    string[] storage ids = _userDocIds[userId];
    for (uint256 i = 0; i < ids.length; i++) {
      if (
        keccak256(abi.encodePacked(ids[i])) ==
        keccak256(abi.encodePacked(docId))
      ) {
        ids[i] = ids[ids.length - 1];
        ids.pop();
        break;
      }
    }
  }

  function isRevoked(
    string calldata userId,
    string calldata docId
  ) external view returns (bool) {
    return _revokedDocuments[userId][docId];
  }

  // Get a single document for a user
  function getDocument(
    string calldata userId,
    string calldata docId
  ) external view returns (bytes32, string memory) {
    Document storage doc = _userDocuments[userId][docId];
    return (doc.sha256Hash, doc.docId);
  }

  // Get all docIds for a user
  function getDocumentIds(
    string calldata userId
  ) external view returns (string[] memory) {
    return _userDocIds[userId];
  }

  // Example: get the Document struct for each docId (optional helper)
  function getAllDocumentsForUser(
    string calldata userId
  ) external view returns (Document[] memory) {
    string[] storage ids = _userDocIds[userId];
    Document[] memory docs = new Document[](ids.length);
    for (uint256 i = 0; i < ids.length; i++) {
      docs[i] = _userDocuments[userId][ids[i]];
    }
    return docs;
  }

  function verifyDocument(
    string calldata userId,
    string calldata docId,
    bytes32 sha256Hash
  ) external view returns (bool) {
    Document storage doc = _userDocuments[userId][docId];
    return doc.sha256Hash == sha256Hash;
  }
}
