import dotenv from "dotenv";
dotenv.config();

import hpp from "hpp";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import compression from "compression";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Routes
import "./passport-setup.js";
import authRouters from "../routes/auth-routes.js";
import oauthRouters from "../routes/oauth-routes.js";
import usersRouters from "../routes/user-routes.js";
import postsRouters from "../routes/post-routes.js";
import tagsRouters from "../routes/tag-routes.js";
import aboutRouters from "../routes/about-routes.js";
import categoriesRouters from "../routes/category-routes.js";
import otherRoutes from "../routes/other-routes.js";

// Error
import AppError from "../utils/error/app-error.js";
import errorHandler from "../utils/error/handle-error.js";

export const app = express();

//Implement CORS
app.use(cors());

//Allow preflight
app.options("*", cors());

//Body parser
app.use(bodyParser.json({ limit: "10kb" })); //to JSON
app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" })); //Obj will contain values of any type instead of just strings.

//Cookie parser
app.use(cookieParser());

//Serving static file
app.use("/upload/images", express.static(path.join("upload", "images")));

//Set security HTTP header
app.use(helmet());

//Development logging
if (process.env.APP_ENV === "dev") {
  app.use(morgan("dev"));
}

//Limit requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 10 * 60 * 1000,
  message: "Too many request from the IP, please try again later",
});
app.use("/", limiter);

//XSS sanitization
app.use(xss());

//Prevent parameter pollution
app.use(hpp({ whitelist: ["id"] }));

//Session
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// initalize passport
app.use(passport.initialize());

// deserialize cookie from the browser
app.use(passport.session());

//Test middleware
app.use((req, res, next) => {
  //your testing
  next();
});

//Allow CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true, // allow session cookie from browser to pass through
  })
);

//Route
const host = "/api/v1";
app.use(host + "/auth", authRouters);
app.use(host + "/oauth", oauthRouters);
app.use(host + "/users", usersRouters);
app.use(host + "/posts", postsRouters);
app.use(host + "/tags", tagsRouters);
app.use(host + "/categories", categoriesRouters);
app.use(host + "/about", aboutRouters);
app.use(host, otherRoutes);

//Compress response bodies
app.use(compression());

//Undefined Route Case
app.all("*", (req, res, next) => {
  next(new AppError("Could not find this route", 404));
});

//Deal with Error
app.use(errorHandler);

export default app;

// Reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
// Reference:https://stackoverflow.com/questions/65168579/separating-socket-io-calls-for-cleaner-code-in-node-and-express
