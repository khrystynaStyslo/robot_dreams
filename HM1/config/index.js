import { config as load } from 'dotenv';
load();

function required(key) {
    const v = process.env[key];

    if (v === undefined) {
        throw new Error(`Missing ENV: ${key}`);
    }
    return v;
}

export const config = {
    port:      Number(required('PORT')),
    nodeEnv:   process.env.NODE_ENV || 'production',
    isDev:     process.env.NODE_ENV === 'development',
};