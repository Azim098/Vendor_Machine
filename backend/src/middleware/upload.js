const multer = require('multer');
const path = require('path');
const fs = require('fs');


const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const absUploads = path.join(__dirname, '..', '..', UPLOAD_DIR);
if (!fs.existsSync(absUploads)) fs.mkdirSync(absUploads, { recursive: true });


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, absUploads),
filename: (req, file, cb) => {
const ext = path.extname(file.originalname);
const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
cb(null, name);
}
});


const upload = multer({
storage,
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
fileFilter: (req, file, cb) => {
const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
const ext = path.extname(file.originalname).toLowerCase();
cb(null, allowed.includes(ext));
}
});


module.exports = upload;