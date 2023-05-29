import express from "express";
import http from "http";
import Redis from "ioredis";
export const redis = new Redis();

const app = express();
app.get("/favicon.ico", (req, res) => res.sendFile("/favicon.ico"));

app.use(async (req, res) => {
  const { url } = req;
  const serversResTime = await redis.zrange("resTime", 0, -1, "WITHSCORES");
  const serverIpWithResTime = {};
  serversResTime.forEach((ele, i) => {
    if (i % 2) serverIpWithResTime[ele] = serversResTime[i - 1];
  });

  const [minResTime] = Object.keys(serverIpWithResTime).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  const server = serverIpWithResTime[minResTime];

  console.log(serverIpWithResTime);
  console.log("Min response time:", minResTime);
  console.log("Min response time ip:", server);

  const startTime = Date.now();
  http.get(`${server}${url}`, (backendRes) => {
    backendRes.pipe(res);
    const endTime = Date.now();
    redis.zadd("resTime", endTime - startTime, server);
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Load balancer is running on port ${PORT}`);
});
