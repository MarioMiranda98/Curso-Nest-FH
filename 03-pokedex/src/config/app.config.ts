export const envConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongoDbUrl: process.env.MONGO_DB_URL,
  mongoDbName: process.env.MONGO_DB_NAME,
  mongoInitDbUsername: process.env.MONGO_INITDB_ROOT_USERNAME,
  mongoInitDbPassword: process.env.MONGO_INITDB_ROOT_PASSWORD,
  port: process.env.PORT || 3000,
  defaultLimit: process.env.DEFAULT_LIMIT || 10
});