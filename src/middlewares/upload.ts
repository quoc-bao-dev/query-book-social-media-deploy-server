import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    },
});
export const upload = multer({ storage });
