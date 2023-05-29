import dotenv from "dotenv";

dotenv.config();

const servers = [process.env.SERVER_IP_1, process.env.SERVER_IP_2];

// const addWeights = (ip, weight) => {
//   for (let i = 0; i < weight; i++) servers.push(ip);
// };

export default servers;
