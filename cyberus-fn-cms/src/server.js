const express = require('express');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler(); // Let Next handle routes

app.prepare().then(() => {
  const server = express();

  

  // Let Next handle everything else
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Server ready on http://localhost:${port}`);
  });
});
