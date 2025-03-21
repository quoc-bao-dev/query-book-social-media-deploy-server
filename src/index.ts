import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import router from './routes';

const app = express();
export const PORT = process.env.PORT || 3009;
export const deployFolder = path.join(__dirname, 'public');
const domain = process.env.DOMAIN || 'localhost';
const mongoURL =
    process.env.MONGO_URL || 'mongodb://localhost:27017/query-book-deployment';

mongoose.connect(mongoURL).then(() => {
    console.log('Connect to deploy server');
});

if (!fs.existsSync(deployFolder)) {
    fs.mkdirSync(deployFolder, { recursive: true });
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware xử lý subdomain
app.use((req: Request, res: Response, next: NextFunction) => {
    const host = req.headers.host?.split(':')[0];
    const [subdomain] = host?.split('.') || [];

    if (subdomain && subdomain !== 'localhost') {
        const appDeployPath = path.join(deployFolder, subdomain);
        if (fs.existsSync(appDeployPath)) {
            return express.static(appDeployPath)(req, res, next);
        } else {
            return res.status(404).send('Application not found');
        }
    }
    next();
});

// API upload và deploy file tĩnh
// app.post(
//     '/deploy',
//     upload.single('staticFile'),
//     async (req: Request, res: Response) => {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const uploadedFilePath = req.file.path;
//         const appId = uuidv4().slice(0, 8); // Rút gọn ID cho dễ nhớ
//         const appDeployPath = path.join(deployFolder, appId);

//         try {
//             if (path.extname(req.file.originalname) === '.zip') {
//                 await decompress(uploadedFilePath, appDeployPath);
//             } else {
//                 fs.mkdirSync(appDeployPath, { recursive: true });
//                 fs.copyFileSync(
//                     uploadedFilePath,
//                     path.join(appDeployPath, req.file.originalname)
//                 );
//             }

//             const appUrl = `http://${appId}.localhost:${PORT}`;
//             res.status(200).json({
//                 message: 'Static files deployed successfully',
//                 url: appUrl,
//             });
//         } catch (error) {
//             console.error('Error during deployment:', error);
//             res.status(500).json({
//                 message: 'Error during deployment',
//                 error: (error as Error).message,
//             });
//         }
//     }
// );

app.use('/', router);

// Route catch-all để phục vụ index.html cho ứng dụng React
app.use((req: Request, res: Response) => {
    const host = req.headers.host?.split(':')[0];
    const [subdomain] = host?.split('.') || [];

    if (subdomain && subdomain !== domain) {
        const indexPath = path.join(deployFolder, subdomain, 'index.html');
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        }
    }
    res.status(404).send('Application not found or invalid route');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
