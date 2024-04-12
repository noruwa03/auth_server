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

// app.listen(PORT, "localhost", () => {
//   console.log("Server is running at port", PORT);
// });

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
