const fs = require("fs");

const imageModel = require("../model/image");

const uploadImage = async (req, res) => {
  if (!req.body.name)
    return res.status(400).send({ status: false, msg: "name is required" });
  const saveImage = imageModel({
    name: req.body.name,
    image: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then(() =>
      res.status(201).send({ status: true, msg: "Uploaded successfully" })
    )
    .catch((err) => console.log(err.message));
};

module.exports = { uploadImage };
