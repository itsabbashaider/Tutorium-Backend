const app = require("./src/app");
const env = require("./src/config/env"); 

app.listen(env.app.port, () => {
  console.log(
    `🚀 Tutorium API is running in ${env.app.nodeEnv} mode on http://localhost:${env.app.port}`
  );
});