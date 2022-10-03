const express = require("express");
const router = express.Router();

const imageController = require("../controller/image");
const uploadImg = require("../utils/helper");
const auth = require("../middleware/auth");

router.post("/upload", auth.authentication , uploadImg.upload, imageController.uploadImage);

module.exports = router;
