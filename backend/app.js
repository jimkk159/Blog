import express from "express";

import postRouters from "./routes/post-route.js";

const app = express();

app.get("/", (req, res, next) => {
  res.json({ hello: "Hello World" });
});

app.use("/posts", postRouters);

const port = 5000;
app.listen(port, () => console.log("Server running on port 5000"));
//reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module