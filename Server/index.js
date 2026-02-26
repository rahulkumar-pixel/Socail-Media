import express from "express";
import dotenv from "dotenv";
dotenv.config("./.dotenv");
import authRouter from "./router/authRouter.js";
import connectdb from "./dbConnect.js";
import postRouter from "./router/postsRouter.js";
import userRouter from "./router/userRouter.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
// middleWare
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://socail-media-jet.vercel.app/",
  }),
);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.status(200).send();
});

const PORT = process.env.PORT || 3000;
connectdb();
app.listen(PORT, () => {
  console.log("Listening on port 4000");
});
