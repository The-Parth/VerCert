import express from 'express';
import dotenv from 'dotenv';
import { uploadToAzure, generateSasUrl } from '../src/azureBlob.js';

dotenv.config();

const router = express.Router();

function fileSizeToHuman(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }`;
}

router.post('/uploadcert', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const fileName = file.name;
  const size = fileSizeToHuman(file.data.length);

  if (file.mimetype !== 'application/pdf') {
    return res
      .status(400)
      .json({ msg: 'Invalid file type. Only PDF allowed.' });
  }

  if (file.data.length > 10 * 1024 * 1024) {
    return res.status(400).json({ msg: 'File too large. Max 10MB allowed.' });
  }

  try {
    const fileUrl = await uploadToAzure(file.data, fileName, file.mimetype);
    const sasUrl = await generateSasUrl(fileUrl, 10); // 10 minutes expiry
    const blobUrl = fileUrl.split('?')[0]; // Remove SAS token from URL
    res.json({
      msg: 'File uploaded successfully!',
      url: fileUrl,
      blobUrl,
      sasUrl,
    });
  } catch (error) {
    res.status(500).json({ msg: 'File upload failed', error: error.message });
  }
});

export default router;
