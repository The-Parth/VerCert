import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'certs';

if (
  !AZURE_STORAGE_CONNECTION_STRING ||
  !AZURE_STORAGE_ACCOUNT_NAME ||
  !AZURE_STORAGE_ACCOUNT_KEY
) {
  throw new Error('Missing Azure storage environment variables.');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY
);

/**
 * Uploads a file buffer to Azure Blob Storage.
 * @param {Buffer} fileBuffer - The file data in Buffer format.
 * @param {string} fileName - The name of the file to store in Azure.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} - Returns the public URL of the uploaded file.
 */
export async function uploadToAzure(fileBuffer, fileName, mimeType) {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: mimeType || 'application/octet-stream',
      },
    });

    console.log(`File "${fileName}" uploaded successfully.`);
    return blockBlobClient.url; // Return the file URL
  } catch (error) {
    console.error('Error uploading file to Azure Blob Storage:', error.message);
    throw error;
  }
}

/**
 * Generates a one-time access SAS URL from a public blob URL.
 * @param {string} publicUrl - The public URL of the stored file.
 * @param {number} expiryMinutes - Expiry time in minutes (default 10).
 * @returns {Promise<string>} - Returns the secure SAS URL.
 */
export async function generateSasUrl(publicUrl, expiryMinutes = 10) {
  try {
    // Extract and decode the blob name from the URL
    const decodedUrl = decodeURIComponent(publicUrl);
    const fileName = decodedUrl.split('/').pop(); // Correctly get the file name

    if (!fileName) throw new Error('Invalid public URL format.');

    // Set expiry time
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + expiryMinutes);

    // Generate SAS token with read-only permission
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: CONTAINER_NAME,
        blobName: fileName,
        expiresOn,
        permissions: BlobSASPermissions.parse('r'), // Read-only access
      },
      sharedKeyCredential
    ).toString();

    // Construct the correct SAS URL
    const sasUrl = `${containerClient.getBlockBlobClient(fileName).url}?${sasToken}`;
    return sasUrl;
  } catch (error) {
    console.error('Error generating SAS URL:', error.message);
    throw error;
  }
}
