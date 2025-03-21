import { config } from '../config';

export const getUrl = (subDomain: string) =>
    `http://${subDomain}.localhost:${config.PORT}`;
