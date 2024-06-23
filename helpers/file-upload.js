const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image extension");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '_');
    const extension = file.originalname.split('.').pop();
    cb(null, `${fileName}_${Date.now()}.${extension}`);
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;
