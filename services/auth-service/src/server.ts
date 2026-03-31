import { createApp } from "./app";
import { env } from "./config/env";
import { checkDatabaseConnection, prisma } from "./config/prisma";
import { DatabaseConfigError, DatabaseConnectionError } from "./errors/database.errors";

const logDatabaseStatus = (error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("Database status: failed");
  if (error instanceof DatabaseConfigError || error instanceof DatabaseConnectionError) {
    // eslint-disable-next-line no-console
    console.error(`${error.name}: ${error.message}`);
    return;
  }
  // eslint-disable-next-line no-console
  console.error("Failed to connect to database:", error);
};

const startServer = () => {
  const app = createApp();
  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Environment: ${env.nodeEnv ? "development" : "production"}`);
    console.log(`- Local: http://localhost:${env.port}`);
    console.log(`- API: http://localhost:${env.port}/api`);
  });

  void checkDatabaseConnection()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Database status: connected");
    })
    .catch(logDatabaseStatus);

  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`${signal} received. Closing server and database connection...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

void startServer();

