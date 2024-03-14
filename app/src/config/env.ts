// config/env.js
const environments = {
  development: {
    serverUrl: "http://localhost:3000",
  },
  test: {
    serverUrl: "https://your-staging-server.com",
  },
  production: {
    serverUrl: "https://your-production-server.com",
  },
};

const getEnv = (): string => {
  const env = process.env.NODE_ENV || "development";
  return (
    environments[env]["serverUrl"] || environments.development["serverUrl"]
  );
};

export default getEnv;
