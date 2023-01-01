import express from "express";
import bodyParser from "body-parser";

//Routes
import postRouters from "./routes/post-route.js";

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

app.use("/posts", postRouters);

const port = 5000;
app.listen(port, () => console.log("Server running on port 5000"));
//reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
