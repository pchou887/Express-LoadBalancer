import express from "express";
import http from "http";
import servers from "./models/servers.js";

const app = express();
app.get("/favicon.ico", (req, res) => res.sendFile("/favicon.ico"));

let currentServerIndex = 0;

app.use((req, res) => {
  const { url } = req;
  const server = servers[currentServerIndex];
  console.log(server);
  currentServerIndex = (currentServerIndex + 1) % servers.length;
  http.get(`${server}${url}`, (backendRes) => {
    backendRes.pipe(res);
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Load balancer is running on port ${PORT}`);
});
