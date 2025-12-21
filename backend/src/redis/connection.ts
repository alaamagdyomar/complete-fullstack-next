import { createClient } from "redis";

let redisClient = createClient();

const initializeRedis = async () => {
  try {
    redisClient.on("error", (error) =>
      console.log("error event occurred in redis", error)
    );
    await redisClient.connect();
    console.log("redis connection successfull");
  } catch (err) {
    console.log("error from radis connection =", err);
    throw err;
  }
};

export { redisClient, initializeRedis };
