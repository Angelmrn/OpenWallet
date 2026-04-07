import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import organizationRoutes from "./routes/organization.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "1234";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", authRoutes);
app.use("/api/organizations", organizationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to TaskFlow API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
