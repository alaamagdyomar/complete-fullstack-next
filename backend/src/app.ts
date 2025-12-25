import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import appRouter from "./routers";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));

// 1- first step to make any request to go through to make the data type JSON
app.use(express.json());
// 2- EXPRESS.URLENCODED => INSIDE that we would be getting some form type data with the url encoded
app.use(express.urlencoded({ extended: true }));
// 3 - will use helmet as it provides some headers in the application this provides for security
app.use(helmet());
// 4 - install the morgan library for logging the requests and details
app.use(morgan("dev"));
// 5 - what url we will use for main routing
app.use("/api/v1/auth", appRouter);

export default app;
