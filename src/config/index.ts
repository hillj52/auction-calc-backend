import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI not defined');
}

if (!process.env.MONGO_USERNAME) {
  throw new Error('MONGO_USERNAME not defined');
}

if (!process.env.MONGO_PASSWORD) {
  throw new Error('MONGO_PASSWORD not defined');
}

if (!process.env.PEPPER) {
  throw new Error('PEPPER not defined');
}

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY not defined');
}

if (!process.env.TEAM_MAX_BUDGET) {
  throw new Error('TEAM_MAX_BUDGET not defined');
}

export default {
  port: parseInt(process.env.PORT || '4000', 10),
  database: {
    URI: process.env.MONGO_URI,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
  pepper: process.env.PEPPER,
  JWT: {
    key: process.env.JWT_KEY,
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/api',
  },
  team: {
    maxBudget: +process.env.TEAM_MAX_BUDGET,
  },
};
