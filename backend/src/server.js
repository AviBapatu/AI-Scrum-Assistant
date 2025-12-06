import express from "express";
import cors from "cors";
import scrumRoutes from "./routes/scrum.routes.js";
import { setupSwagger } from "./swagger.js";
import authRoutes from "./routes/auth.routes.js";
import jiraRoutes from "./routes/jira.routes.js";
import jiraCloudRoutes from "./routes/jiraCloud.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Allows larger payloads
app.use("/auth", authRoutes);
app.use("/auth/jira", jiraRoutes);

// Swagger UI
setupSwagger(app);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "AI Scrum Assistant Backend is running.",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth/jira", jiraCloudRoutes);
app.use("/api/v1/scrum", scrumRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).send({
    error: message,
  });
});

export default app;
