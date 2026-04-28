import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TinyID from '../../utils/tinyID';

// base upload folder (safe for prod build)
const baseUploadPath = path.join(process.cwd(), 'src/uploads');

// ensure folders exist
const ensureDir = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

// generic storage factory
const createStorage = (subFolder: string) => {
  const uploadPath = path.join(baseUploadPath, subFolder);
  ensureDir(uploadPath);

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `${TinyID(10)}-${Date.now()}${ext}`;
      cb(null, fileName);
    },
  });
};

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, path.join(__dirname, '../../uploads'));
//   },
//   filename: (_req, file, cb) => {
//     const fileName = `${TinyID(10)}-${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, fileName);
//   },
// });

//
// ✅ CV uploader (PDF only)
//
export const uploadCV = multer({
  storage: createStorage('cv'),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

//
// ✅ Image uploader (JobPost)
//
export const uploadImage = multer({
  storage: createStorage('images'),
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  },
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
});
