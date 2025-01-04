import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import companyRouter from "./routes/companyRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
dotenv.config({});

const app = express();

// middle
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // chỉ cho phép domian này
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

//routes
app.use("/api/auth", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use("/api/category", categoryRouter);

const PORT = process.env.PORT || 3001;

//run server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
