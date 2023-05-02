// ----------------Exception Error------------------
export const handleUncaughtException = () => {
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION!! Shutting down..");
    console.log(err);
    process.exit(1);
  });
};

export const handleUnhandledRejection = () => {
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLER REJECTION!! Shutting down..");
    console.log(err);
    server.close(() => {
      process.exit(1);
    });
  });
};
