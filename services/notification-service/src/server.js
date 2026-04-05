import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});