import Redis from "ioredis";
import servers from "../models/servers.js";
const redis = new Redis();

const updateTime = async () => {
  servers.forEach(async (ele, i) => {
    const startTime = Date.now();
    await fetch(servers[i]);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(servers[i], responseTime);
    redis.zadd("resTime", responseTime, servers[i]);
  });
};

updateTime();
const interval = setInterval(updateTime, 1000 * 60);
