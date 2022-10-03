const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const user = require("./route/user");
const image = require("./route/image");
const app = express();

app.use(express.json());

app.use("/", user);
app.use("/", image);

mongoose
  .connect(
    "mongodb+srv://Nishant-R:cMVSc6ePV6V4dr03@cluster0.rembes2.mongodb.net/helisverse",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err.message));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
