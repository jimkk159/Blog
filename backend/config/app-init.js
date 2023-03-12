import dotenv from "dotenv";
dotenv.config();
import hpp from "hpp";
import cors from "cors";
import path from "path";
import http from "http";
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

//Models
import HttpError from "../utils/http-error.js";
import passportSetup from "./passport-setup.js";
import errorHandler from "../controllers/error-controller.js";

//Routes
import authRouters from "../routes/auth-routes.js";
import usersRouters from "../routes/user-routes.js";
import postsRouters from "../routes/post-routes.js";
import topicsRouters from "../routes/topic-routes.js";



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
if (process.env.APP_ENV === "development") {
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
app.use(hpp({ whitelist: ["yourWhiteList"] }));

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
app.use("/auth", authRouters);
app.use("/user", usersRouters);
app.use("/post", postsRouters);
app.use("/topic", topicsRouters);

//Compress response bodies
app.use(compression());

//Undefined Route Case
app.all("*", (req, res, next) => {
  next(new HttpError("Could not find this route", 404));
});

//Deal with Error
app.use(errorHandler);

export const server = http.createServer(app);

// Reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
// Reference:https://stackoverflow.com/questions/65168579/separating-socket-io-calls-for-cleaner-code-in-node-and-express
