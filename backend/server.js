const app = require("./src/app");
const config = require("./src/config/config"); 

app.listen(config.app.port, () => {
  console.log(
    `🚀 Tutorium API is running in ${config.app.nodeEnv} mode on http://localhost:${config.app.port}`
  );
});