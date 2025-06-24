import { config as load } from 'dotenv';
load();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  hotReload: process.env.HOT_RELOAD !== 'false',
  routesDir: process.env.ROUTES_DIR || 'src/routes',
  databaseFile: process.env.DATABASE_FILE || 'database.json',
};