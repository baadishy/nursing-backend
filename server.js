const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { PORT = 5000 } = require("./config/env");
const { connectDB } = require("./config/database");
const errorMiddleware = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const quizAttemptRoutes = require("./routes/quizAttemptRoutes");

const app = express();
console.log(process.env.FRONTEND_URL, "FRONTEND_URL");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api", lessonRoutes);
app.use("/api", quizRoutes);
app.use("/api", questionRoutes);
app.use("/api", quizAttemptRoutes);

app.use(errorMiddleware);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
