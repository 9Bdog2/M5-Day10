import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouter from "./media/index.js";

const server = express();
/* Global Middlewares */
server.use(cors());
server.use(express.json());
/* Endpoints */
server.use("/media", mediaRouter);
/* Error Middlewares */

const port = 3001;

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port :", port);
});

export default server;
