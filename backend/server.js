import {
  handleUncaughtException,
  handleUnhandledRejection,
} from "./utils/error/exceotuion-error.js";
handleUncaughtException();

import dotenv from "dotenv";
dotenv.config();
import "./config/db-init.js";

import app from "./config/app.js";

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}...`));

handleUnhandledRejection();
