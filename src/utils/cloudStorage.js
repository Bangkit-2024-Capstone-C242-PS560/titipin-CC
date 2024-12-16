const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

// Konfigurasi Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../ServiceAccountKey.json'), 
  projectId: process.env.GCLOUD_PROJECT_ID,
});

console.log('Bucket Name:', process.env.STORAGE_BUCKET); 
const bucketName = process.env.STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);


// Fungsi untuk upload file ke Cloud Storage
const uploadImage = (file, folder = '') => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file; 
    const fileName = `${folder}${originalname.replace(/ /g, '_')}`; 
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (error) => reject(error));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl); // URL publik 
    });

    blobStream.end(buffer); // Tulis buffer ke Cloud Storage
  });
};

module.exports = { uploadImage };
