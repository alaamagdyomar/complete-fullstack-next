import { redisClient } from "./connection";

// handling setting redis cache
const setCache = async (key: string, data: string, EX: number) => {
  console.log("type of time =", typeof EX);
  try {
    await redisClient.set(key, data, { EX });
    console.log("Redis: SET-Cache", key, "Value: ", data);
  } catch (error) {
    console.log(
      "Error while setting redis data: ",
      "Key: ",
      key,
      "value",
      data,
      "Error:",
      error
    );
    throw error;
  }
};

const getCache = async (key: string) => {
  try {
    const value = await redisClient.get(key);
    console.log("Redis: GET-Cache", key, "Value: ", value);
    return value;
  } catch (error) {
    console.log(
      "Error while getting redis data: ",
      "Key: ",
      key,
      "Error:",
      error
    );
    throw error;
  }
};

export { setCache, getCache };
