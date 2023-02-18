import { server } from "./server-init.js";

const port = process.env.PORT || 5000;
server.listen(port, () => console.log("Server running on port 5000"));
// Reference:https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
// Reference:https://stackoverflow.com/questions/65168579/separating-socket-io-calls-for-cleaner-code-in-node-and-express
