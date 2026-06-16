// API placeholder — Trajetórias 2.0
// Será expandido a cada Sprint conforme os GitHub Issues

const PORT = process.env.PORT ?? 3001;

// Usando HTTP nativo (sem dependências) para o placeholder
import { createServer } from 'node:http';

const routes = {
  'GET /health': () => ({
    status: 'ok',
    service: 'trajetorias2-api',
    version: '0.1.0',
    env: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  }),
  'GET /': () => ({
    name: 'Trajetórias 2.0 API',
    docs: 'https://github.com/gustavoparolin/trajetorias2',
    status: 'em construção — MVP Sprint 1',
  }),
};

const app = createServer((req, res) => {
  const key = `${req.method} ${new URL(req.url, 'http://localhost').pathname}`;
  const handler = routes[key];

  const origin = req.headers.origin ?? '';
  const allowed = (process.env.FRONTEND_ORIGINS ?? '').split(',');
  if (allowed.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Rota não encontrada', path: req.url }));
  }

  const body = JSON.stringify(handler());
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(body);
});

app.listen(PORT, () => {
  console.log(`✅ trajetorias2-api rodando na porta ${PORT}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   DEMO_MODE: ${process.env.DEMO_MODE ?? 'false'}`);
});
