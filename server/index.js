const express = require("express");
const databaseConnect = require("./config/database");
// const cloudinaryConnect = require("./config/clodinary");
// const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const communityRoutes = require("./routes/Community");
const postRoutes = require("./routes/Post");
const doubtRoutes = require("./routes/Doubt");
const commentRoutes = require("./routes/Comment");
const tagRoutes = require("./routes/Tag");
const friendroutes = require("./routes/Friends");
const searchroutes = require("./routes/search");
const answerroutes = require("./routes/Answer");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );

databaseConnect();
// cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/tag", tagRoutes);
app.use("/api/v1/community", communityRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/doubt", doubtRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/friends", friendroutes);
app.use("/api/v1/search", searchroutes);
app.use("/api/v1/answer", answerroutes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});