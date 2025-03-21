import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload';

const router = Router();

router.get(
    '/get-hostings/:id',
    authMiddleware,
    uploadController.getHostingByUserId
);

router.post(
    '/upload',
    authMiddleware,
    upload.single('file'),
    uploadController.upload
);

router.post('/create-hosting', authMiddleware, uploadController.createHosting);

router.delete(
    '/delete-hosting/:subDomain',
    authMiddleware,
    uploadController.delete
);

export default router;
