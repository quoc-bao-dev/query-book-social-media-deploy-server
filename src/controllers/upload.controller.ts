import decompress from 'decompress';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import accountService from '../services/account.service';
import deployService from '../services/deploy.service';
import { getUrl } from '../utils';

const uploadController = {
    getHostingByUserId: async (req: Request, res: Response) => {
        const userId = req.params.id;

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

        const data = await deployService.getDeployByUserId(userId!);
        res.status(200).json({
            message: 'Get hostings successful',
            data,
        });
    },
    upload: async (req: Request, res: Response) => {
        const subDomain = req.body?.subDomain;
        const userId = req.body?.userId;

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

        if (!subDomain) {
            res.status(400).json({ message: 'Subdomain is required' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const uploadedFilePath = req.file.path;
        const appDeployPath = path.join(config.DEPLOY_FOLDER, subDomain);

        // Validate subdomain
        const subdomain = await deployService.getDeployBySubDomain(subDomain);
        if (!subdomain) {
            res.status(404).json({ message: 'Subdomain not found' });
            return;
        }

        // Validate user
        if (subdomain.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        try {
            if (path.extname(req.file.originalname) === '.zip') {
                await decompress(uploadedFilePath, appDeployPath);
            } else {
                fs.mkdirSync(appDeployPath, { recursive: true });
                fs.copyFileSync(
                    uploadedFilePath,
                    path.join(appDeployPath, req.file.originalname)
                );
            }

            const appUrl = getUrl(subDomain);

            // Xóa file upload
            fs.unlinkSync(uploadedFilePath);

            res.status(200).json({
                message: 'Static files deployed successfully',
                url: appUrl,
                subDomain,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error during deployment',
                error: (error as Error).message,
            });
        }
    },

    createHosting: async (req: Request, res: Response) => {
        const subDomain = req.body?.subDomain;
        const userId = req.body?.userId;

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

        if (!subDomain) {
            res.status(400).json({ message: 'Subdomain is required' });
            return;
        }

        // Validate account
        const account = await accountService.getByUserId(userId);

        if (!account) {
            res.status(400).json({ message: 'Account not found' });
            return;
        }

        // Validate subdomain
        const subdomain = await deployService.getDeployBySubDomain(subDomain);
        if (subdomain) {
            res.status(400).json({ message: 'Subdomain already exists' });
            return;
        }

        // Check limit deploy
        const deploys = await deployService.getDeployByUserId(userId);
        if (deploys.length >= account.limitDeploy) {
            res.status(400).json({
                message: 'You have reached the maximum number of deploys',
            });
            return;
        }

        // Create deploy
        const result = await deployService.createDeploy({
            userId,
            subdomain: subDomain,
        });

        res.status(200).json({
            message: 'Deploy created successfully',
            data: result,
        });
    },

    delete: async (req: Request, res: Response) => {
        const subDomain = req.params.subDomain;
        const userId = req?.body?.userId;

        if (!subDomain) {
            res.status(400).json({ message: 'Subdomain is required' });
            return;
        }

        // Validate subdomain
        const subdomain = await deployService.getDeployBySubDomain(subDomain);
        if (!subdomain) {
            res.status(404).json({ message: 'Subdomain not found' });
            return;
        }

        // Validate user
        if (subdomain.userId !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        await deployService.delete({ subDomain, userId });
        await fs.promises.rm(path.join(config.DEPLOY_FOLDER, subDomain), {
            recursive: true,
            force: true,
        });
        res.status(200).json({
            message: 'Deploy deleted successfully',
        });
    },
};

export default uploadController;
