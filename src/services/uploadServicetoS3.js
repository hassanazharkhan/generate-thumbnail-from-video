import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import uuid from 'uuid/v1';
import path from 'path';

let S3folderPath = undefined;

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  Bucket: process.env.AWS_BUCKET_NAME
})

const multerS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function(req, file, cb) {
    file.fileKey = uuid() + path.extname(file.originalname);
    cb(null, S3folderPath + '/' + file.fileKey);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
      file.mimetype === 'video/mp4' ? (S3folderPath = 'videos') : (S3folderPath = 'audios');
    cb(null, true);
  } else {
    cb(null, false);
  }
};

class uploadServicetoS3 {
  upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 500 // we are allowing only 500 MB files
    }
  })
}

export default new uploadServicetoS3().upload