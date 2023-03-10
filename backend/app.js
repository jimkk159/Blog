import dotenv from "dotenv";

//Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!! Shutting down..");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config();

import { server } from "./config/app-init.js";

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}...`));

//Uncaught Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLER REJECTION!! Shutting down..");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
// Reference:https://stackoverflow.com/questions/65168579/separating-socket-io-calls-for-cleaner-code-in-node-and-express
