const express = require("express");
const databaseConnect = require("./config/database");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/User");
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

databaseConnect();

app.use("/api/v1/auth", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
  
  app.get("/", (req, res) => {
    return res.json({
      success: true,
      message: "Your server is up and running....",
    });
  });