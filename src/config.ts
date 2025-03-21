import path from 'path';

export const config = {
    PORT: process.env.PORT || 3009,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3009',
    DEPLOY_FOLDER: path.join(__dirname, 'public'),
};
