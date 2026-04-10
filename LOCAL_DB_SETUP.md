# Local Database Setup

The project is now configured to use a local PostgreSQL database.

Connection settings:

- Host: `localhost`
- Port: `5432`
- Database: `erp_location`
- User: `postgres`
- Password: `postgres`

The SQL bootstrap file [database/init/01-schema.sql](/C:/Users/khali/Desktop/ERP-de-location-de-voitures-Plateforme-B/database/init/01-schema.sql) creates the main tables from the class diagram when the PostgreSQL container starts for the first time.

## Start from a clean local database

```bash
docker compose down -v
docker compose up -d
```

`down -v` is important if you already created the old Postgres volume. Without it, Docker will keep the previous data volume and will not rerun the init SQL scripts.

## Backend services

Auth service:

```bash
cd services/auth-service
npm run prisma:generate
npm run dev
```

Notification service:

```bash
cd services/notification-service
npm install
npx prisma generate
npm run dev
```

Notes:

- `services/auth-service/.env` now points to the local database.
- `services/notification-service/.env` was added for the local database.
- `auth-service` Prisma schema validates successfully.
- `notification-service` Prisma validation is currently blocked because the local package install is incomplete there (`dotenv/config` cannot be resolved).
