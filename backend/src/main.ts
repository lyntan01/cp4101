import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routers/UserRouter";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // You could add a list of allowed origins and check against that too
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("https://localhost:")
      ) {
        return callback(null, true);
      }

      // To allow specific domains, add them above this line as additional checks

      // If the origin doesn't match any criteria, reject it
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "50mb" }));

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to backend!" });
});

// Routes
app.use("/api/users", userRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
server.on("error", console.error);
