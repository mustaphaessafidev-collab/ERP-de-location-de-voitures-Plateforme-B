import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Environment: ${env.nodeEnv ? "development" : "production"}`);
  console.log(`- Local: http://localhost:${env.port}`);
  console.log(`- API: http://localhost:${env.port}/api`);
});

