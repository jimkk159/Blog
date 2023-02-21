import fs from "fs";
import path from "path";
import http from "http";
import cors from "cors";
import express from "express";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

//Models
import HttpError from "../models/http-error.js";
import passportSetup from "./passport-setup.js";

//Routes
import authRouters from "../routes/auth-route.js";
import usersRouters from "../routes/users-route.js";
import postsRouters from "../routes/posts-route.js";
import topicsRouters from "../routes/topics-route.js";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());

// deserialize cookie from the browser
app.use(passport.session());

//Allow CORS
app.use(cors());

//Add Static Folder to save images
app.use("/upload/images", express.static(path.join("upload", "images")));
app.use(
  "/upload/images/default",
  express.static(path.join("upload", "images", "default"))
);

app.use("/auth", authRouters);
app.use("/users", usersRouters);
app.use("/posts", postsRouters);
app.use("/topics", topicsRouters);

app.get("/", (req, res, next) => {
  res.json({ hello: "Hello World" });
});

//Undefined Route Case
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//Deal with Error
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
      console.log(req.file.path);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

export const server = http.createServer(app);

// Reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
// Reference:https://stackoverflow.com/questions/65168579/separating-socket-io-calls-for-cleaner-code-in-node-and-express
