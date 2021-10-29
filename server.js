import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

const server = express();
/* Global Middlewares */
server.use(cors());
server.use(express.json());
/* Endpoints */

/* Error Middlewares */

const port = 3001;

console.log(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port :", port);
});
