const multer = require('multer');

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the directory where uploaded files will be saved
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Specify how uploaded files should be named
      cb(null, file.originalname);
    },
  });
  