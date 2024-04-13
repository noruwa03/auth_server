const express = require("express");
// const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const router = require("./router");
const { PORT } = process.env;

const app = express();
app.use(cookieParser());
const path = require("path");

// const whitelist = ["http://localhost:5173", "https://auth-test-n.vercel.app"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (whitelist.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

const baseDirectory = path.resolve(__dirname, ".");

app.use(express.static(path.join(baseDirectory, "dist")));
app.use(express.json());

app.use("/api/v1", router);

app.get("*", (_, res) => {
  res.sendFile(path.join(baseDirectory, "/dist/index.html"));
});

// app.listen(PORT, "localhost", () => {
//   console.log("Server is running at port", PORT);
// });

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
