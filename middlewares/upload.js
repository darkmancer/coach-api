const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
    cloud_name: "darkmancer",
    api_key: "111775957868488",
    api_secret: "lLvvfpZzG44eKd-n1mxBPGXRIN8",
  });

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  },
});

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] == "jpeg" ||
      file.mimetype.split("/")[1] == "png"
    )
      cb(null, true);
    else {
      cb(new Error("this file is not a photo"));
    }
  },
});
