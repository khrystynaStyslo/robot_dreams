import http from "http";
import type { Router } from '../lib/router';

export function createServer(router: Router) {
    return http.createServer(async (req, res) => {
        try {
            const handled = await router.handleRequest(req, res);

            if (!handled) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Route not found' }));
            }
        } catch (error) {
            console.error('Server error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}
