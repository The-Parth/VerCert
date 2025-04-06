import express from 'express';
// import multer from 'multer';
import crypto from 'crypto';
import { JsonRpcProvider, Wallet, Contract, ethers } from 'ethers';
import { uploadToAzure, generateSasUrl } from '../src/azureBlob.js';

import { rateLimit } from 'express-rate-limit';

import DocumentStorageABI from '../artifacts/DocumentStorageV2.json' with { type: 'json' };
import dotenv from 'dotenv';

const router = express.Router();
// const upload = multer();

// Setup ethers contract
const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
const contract = new Contract(
  process.env.CONTRACT_ADDRESS,
  DocumentStorageABI,
  wallet
);

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  message: {
    error:
      "You went too fast my friend, but don't worry… I won't remember this anyway. ~ 💚",
  },
});

const valid256hash = (hash) => {
  // Check if the hash is a valid 256-bit hex string
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

/**
 * POST /block/uploadAndStore
 * Form Data: file, userId
 * Description: Accepts a file from the request, uploads it to Azure Blob Storage,
 * calculates its sha256 hash, and stores the transaction in the contract.
 */

router.post('/', (req, res) => {
  res.json({ msg: 'Block route' });
});

router.get('/', (req, res) => {
  res.json({ msg: 'Block route', version: 1 });
});

router.post('/uploadAndStore', generalLimiter, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      throw new Error(
        'File is missing. Ensure the request has a file attached with "multipart/form-data" content type.'
      );
    }

    const { userId } = req.body;
    const uploadedFile = req.files.file; // from express-fileupload
    const fileBuffer = uploadedFile.data;
    const fileName = `${userId}-${Date.now()}-${uploadedFile.name}`; // Unique file name

    if (!userId) {
      throw new Error('userId is required');
    }
    if (!uploadedFile) {
      throw new Error('File is required');
    }
    if (!fileBuffer) {
      throw new Error('File buffer is empty');
    }
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      throw new Error('Invalid file type');
    }

    // 1. Upload to Azure Blob
    const blobUrl = await uploadToAzure(
      fileBuffer,
      fileName,
      uploadedFile.mimetype
    );

    // 2. Calculate sha256 hash
    const fileHash = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');
    const sha256Bytes = '0x' + fileHash;

    // 3. Store in blockchain
    const tx = await contract.storeDocument(userId, fileName, sha256Bytes);
    // await tx.wait();

    const sasUrl = await generateSasUrl(blobUrl, 10);

    return res.status(200).json({
      message: 'File uploaded and document stored successfully',
      docId: fileName,
      tempUrl: sasUrl,
      fileHash: fileHash,
      sha256Hash: sha256Bytes,
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.error('Error in uploadAndStore:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// router.post('/testUpload', upload.single('file'), (req, res) => {
//     console.log('File:', req.file);
//     console.log('Body:', req.body);
//     res.json({ received: !!req.file });
// });

/**
 * POST /block/revokeDocument
 * Body: { userId, docId }
 */
router.post('/revokeDocument', async (req, res) => {
  try {
    const { userId, docId } = req.body;

    const tx = await contract.revokeDocument(userId, docId);
    await tx.wait();
    return res.status(200).json({
      message: 'Document revoked successfully',
      transactionHash: tx.hash,
    });
  } catch (err) {
    console.error('Error revoking document:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /block/getDocument
 * Query params: ?userId=...&docId=...
 */
router.get('/getDocument', async (req, res) => {
  try {
    const { userId, docId } = req.query;

    const [hash, storedDocId] = await contract.getDocument(userId, docId);
    if (!hash || !storedDocId) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if the hash is valid
    if (!valid256hash(hash)) {
      return res.status(400).json({ error: 'Invalid hash format' });
    }

    // Get the blob URL from the storedDocId
    const blobUrl = `${process.env.AZURE_BLOB_URL}/${storedDocId}`;
    // Generate a temporary SAS URL for the blob
    const sasUrl = await generateSasUrl(blobUrl, 10); // 10 minutes expiry
    return res.status(200).json({
      sha256Hash: hash,
      docId: storedDocId,
      tempUrl: sasUrl,
    });
  } catch (err) {
    console.error('Error retrieving document:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /block/isRevoked
 * Query params: ?userId=...&docId=...
 */
router.get('/isRevoked', async (req, res) => {
  try {
    const { userId, docId } = req.query;

    const revoked = await contract.isRevoked(userId, docId);
    return res.status(200).json({ revoked });
  } catch (err) {
    console.error('Error checking revocation:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /block/getDocumentIds
 * Query params: ?userId=...
 */
router.get('/getDocumentIds', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('userId:', typeof userId, userId);

    const docIds = await contract.getDocumentIds(userId);
    return res.status(200).json({ docIds });
  } catch (err) {
    console.error('Error retrieving doc IDs:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /block/getAllDocumentsForUser
 * Query params: ?userId=...
 */
router.get('/getAllDocumentsForUser', async (req, res) => {
  try {
    const { userId } = req.query;

    const documents = await contract.getAllDocumentsForUser(userId);
    const serializedDocuments = documents.reduce((acc, doc) => {
      acc[doc[1]] = {
        hash: doc[0],
        timestamp: doc[2].toString(), // Convert BigInt to string
      };
      return acc;
    }, {});

    return res.status(200).json(serializedDocuments || []);
  } catch (err) {
    console.error('Error retrieving all documents:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /block/verifyDocument
 * Query params: ?userId=...&docId=...&sha256Hash=...
 */
router.get('/verifyDocument', async (req, res) => {
  try {
    const { userId, docId, hash } = req.query;

    if (!userId || !docId || !hash) {
      return res
        .status(400)
        .json({ error: 'Missing userId, docId, or hash parameter' });
    }

    const isValid = await contract.verifyDocument(userId, docId, hash);
    return res.status(200).json({ isValid });
  } catch (err) {
    console.error('Error verifying document:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /block/verifyDocumentByDocId
 * Query params: ?docId=...
 * Description: Calls verifyDocumentByDocId on the contract and returns the result.
 */
router.get('/verifyDocumentByDocId', async (req, res) => {
  try {
    const { docId } = req.query;
    if (!docId) {
      return res.status(400).json({ error: 'Missing docId parameter' });
    }
    const result = await contract.verifyDocumentByDocId(docId);
    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error verifying document by docId:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /block/verifyDocumentsByHash
 * Query params: ?sha256Hash=...
 * Description: Calls verifyDocumentsByHash on the contract and returns the document ID and user ID arrays.
 */
router.get('/verifyDocumentsByHash', async (req, res) => {
  try {
    const { sha256Hash } = req.query;
    if (!sha256Hash) {
      return res.status(400).json({ error: 'Missing sha256Hash parameter' });
    }
    const [userIds, docIds] = await contract.verifyDocumentsByHash(sha256Hash);
    return res.status(200).json({ docIds, userIds });
  } catch (error) {
    console.error('Error verifying documents by hash:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
