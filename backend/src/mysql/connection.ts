import { createPool, Pool } from "mysql2/promise";
import { CREATE_TABLE_USERS } from "./tables";

let pool: Pool;

const connectDatabase = async () => {
  try {
    pool = createPool({
      port: +process!.env!.MYSQL_PORT!,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      //   waitForConnections: true,
      //   connectionLimit: 10,
      //   queueLimit: 0,
    });

    // Optional: test connection (recommended for beginners)
    await pool.getConnection();
    console.log("✅ MySQL connected");
    await pool.execute(CREATE_TABLE_USERS);
    console.log("✅ USERS table created");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
    throw err;
  }
};

export { connectDatabase, Pool };
