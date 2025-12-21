import app from "./app";
import { config } from "dotenv";
import { connectDatabase } from "./mysql/connection";
import { initializeRedis } from "./redis/connection";

config();

const init = async () => {
  try {
    await connectDatabase();
    await initializeRedis();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("now app is listing on this port =", PORT);
    });
  } catch (error) {
    console.log("error from index.ts =", error);
    process.exit(1);
  }
};

init();
