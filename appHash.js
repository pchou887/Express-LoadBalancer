import express from "express";
import http from "http";
import crypto from "crypto";
import servers from "./models/servers.js";

const app = express();

function generateIPHash(ip) {
  const hash = crypto.createHash("md5");
  hash.update(ip);
  const digest = hash.digest("hex");
  return digest;
}

app.use((req, res) => {
  const clientIP = req.ip;
  const { url } = req;
  const hash = generateIPHash(clientIP);
  const backendIndex = parseInt(hash, 16) % servers.length;
  const server = servers[backendIndex];
  console.log(hash);
  console.log(parseInt(hash, 16));
  console.log(backendIndex);
  console.log(server);
  http.get(`${server}${url}`, (backendRes) => {
    backendRes.pipe(res);
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Load balancer is running on port ${PORT}`);
});
