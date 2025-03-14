// Here, we upload the file to our azure s3
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

function fileSizeToHuman(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }`;
}

router.post('/uploadcert', async (req, res) => {
  // Route to upload certificate
  if (!req.files) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const len = req.files.file.length;
  if (len > 1) {
    return res.status(400).json({ msg: 'Only one file allowed' });
  }
  const file = req.files.file;
  const fileName = file.name;
  const size = fileSizeToHuman(file.data.length);
  
  return res.status(200).json({
    msg: 'File uploaded',
    name: fileName,
    size,
  });
});

export default router;

