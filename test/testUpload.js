const fs = require('fs');
const path = require('path');
const { uploadImage } = require('../src/utils/cloudStorage'); 


// File yang ingin diuji
const testFilePath = path.join(__dirname, 'test.png'); 
const fileBuffer = fs.readFileSync(testFilePath);

const testFile = {
  originalname: 'test.png',
  buffer: fileBuffer,
};

uploadImage(testFile, 'event_image/')
  .then((url) => {
    console.log('File berhasil diunggah ke:', url);
  })
  .catch((err) => {
    console.error('Error saat mengunggah file:', err);
  });
