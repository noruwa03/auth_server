const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const router = require("./router");
const { PORT } = process.env;

const app = express();
app.use(cookieParser());

app.use(cors());

app.use(express.json());

app.use("/api/v1", router);

// Set the port based on the environment
const SERVER_PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT : 8000;

app.listen(SERVER_PORT, "localhost", () => {
  console.log("Server is running at port", SERVER_PORT);
});
