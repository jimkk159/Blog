import express from "express";
import bodyParser from "body-parser";

//Models
import HttpError from "./models/http-error.js";

//Routes
import usersRouters from "./routes/users-route.js";
import postsRouters from "./routes/posts-route.js";
import topicsRouters from "./routes/topics-route.js";

const app = express();
app.use(bodyParser.json());

//Allow CROS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/", (req, res, next) => {
  res.json({ hello: "Hello World" });
});

app.use("/users", usersRouters);
app.use("/posts", postsRouters);
app.use("/topics", topicsRouters);

//Undefined Route Case
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//Deal with Error
app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const port = 5000;
app.listen(port, () => console.log("Server running on port 5000"));
//reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
