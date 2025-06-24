import * as path from 'path';
import { Router } from './lib/router';
import { createServer } from './server/server';
import { config } from './config';

const router = new Router(path.join(process.cwd(), config.routesDir));

router.initialize().then(() => {
  const server = createServer(router);

  server.listen(config.port, () => {
    console.log(`Server running on localhost:${config.port}`);

    if (config.hotReload) {
      console.log('Hot reload enabled - route changes will be picked up automatically');
    }
  });

  process.on('SIGINT', () => {
    console.log('\n Shutting down server...');
    router.destroy();

    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

  });
}).catch(error => {
  console.error('Failed to initialize router:', error);
  process.exit(1);
});