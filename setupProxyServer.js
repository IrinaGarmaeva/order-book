const express = require('express');
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  '/data',
  createProxyMiddleware({
    target: 'wss://ws.bitstamp.net',
    ws: true,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Proxy Error:', err);
      res.status(500).send('Proxy Error');
    },
  })
);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
