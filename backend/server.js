import http from 'node:http';

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || 'localhost';

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      service: 'formation-ia-backend',
    });
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    sendJson(response, 404, {
      ok: false,
      message: 'Route API introuvable.',
    });
    return;
  }

  sendJson(response, 404, {
    ok: false,
    message: 'Utilisez une route qui commence par /api.',
  });
});

server.on('error', (error) => {
  console.error(`Le backend n'a pas pu demarrer: ${error.message}`);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Backend pret sur http://localhost:${port}`);
});
