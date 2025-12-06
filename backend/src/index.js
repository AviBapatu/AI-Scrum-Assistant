import "dotenv/config"; 
import app from "./server.js";

const PORT = process.env.PORT || 2000;

function startServer() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error(
      "FATAL ERROR: GOOGLE_API_KEY is not defined in the .env file."
    );
    process.exit(1); // Stop execution if the core AI functionality is disabled
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}`);
  });
}

startServer();
