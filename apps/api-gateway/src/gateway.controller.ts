import { Controller, All, Req, Res } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

type Route = { prefix: string; target: string; rewrite?: (p: string) => string };
const routes: Route[] = [
  { prefix: '/auth',     target: process.env.AUTH_URL     || 'http://auth:3000' },
  { prefix: '/api',      target: process.env.CATALOG_URL  || 'http://catalog:3001', rewrite: p => p.replace(/^\/api/, '') },
  { prefix: '/orders',   target: process.env.ORDERS_URL   || 'http://orders:3003' },
  { prefix: '/payments', target: process.env.PAYMENTS_URL || 'http://payments:3004' },
];

const ALLOW_ORIGIN  = 'http://localhost:3002';
const ALLOW_HEADERS = 'Content-Type, Authorization';
const ALLOW_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';

@Controller()
export class GatewayController {
  @All('*')
  proxy(@Req() req: any, @Res() res: any) {
    const path = req.originalUrl || req.url || '';
    const route = routes.find(r => path.startsWith(r.prefix));
    if (!route) return res.status(404).send('Not found');

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || ALLOW_ORIGIN);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS);
      res.setHeader('Access-Control-Allow-Methods', ALLOW_METHODS);
      res.setHeader('Vary', 'Origin');
      return res.status(204).end();
    }

    const mw = createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      secure: false,
      logLevel: 'warn',
      pathRewrite: route.rewrite ?? (p => p),

      onProxyReq(proxyReq, req2, _res2) {
        if (req2.method !== 'GET' && req2.body && Object.keys(req2.body).length) {
          const bodyData = JSON.stringify(req2.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData).toString());
          proxyReq.write(bodyData);
        }
      },

      onProxyRes(proxyRes, req2) {
        const origin = (req2.headers.origin as string) || ALLOW_ORIGIN;
        proxyRes.headers['access-control-allow-origin'] = origin;
        proxyRes.headers['access-control-allow-credentials'] = 'true';
        proxyRes.headers['access-control-allow-headers'] = ALLOW_HEADERS;
        proxyRes.headers['access-control-allow-methods'] = ALLOW_METHODS;
        proxyRes.headers['vary'] = 'Origin';
      },

      timeout: 30_000,
      proxyTimeout: 30_000,
    });

    return (mw as any)(req, res);
  }
}
