import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const apiKey = req.headers['x-api-key'];

    const checkApiKey = apiKey === process.env.DEPLOY_API_KEY;
    if (checkApiKey) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
