require("dotenv").config();
const { Booking, sequelize } = require("./models");
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: "darkmancer",
  api_key: "111775957868488",
  api_secret: "lLvvfpZzG44eKd-n1mxBPGXRIN8",
});
const util = require("util");
const uploader = util.promisify(cloudinary.uploader.upload);

const multer = require("multer");
const userRoute = require("./routes/userRoute");
const coachRoute = require("./routes/coachRoute");
const bookingRoute = require("./routes/bookingRoute");
const reviewRoute = require("./routes/reviewRoute");
const app = express();
const errorMiddleware = require("./middlewares/error.js");
const userController = require("./controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] == "jpg" ||
      file.mimetype.split("/")[1] == "png"
    )
      cb(null, true);
    else {
      cb(new Error("this file is not a photo"));
    }
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/user", userRoute);

app.use("/coach", coachRoute);
app.post("/register", userController.register);
app.post("/login", userController.login);
app.use("/booking", bookingRoute);
app.use("/review", reviewRoute);

app.put("/upload-slip", upload.single("image"), async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    console.log(bookingId);
    console.log(req.file);

    const result = await uploader(req.file.path);
    const booking = await Booking.update(
      {
        transactionId: result.secure_url,
      },
      { where: { id: bookingId } }
    );
    fs.unlinkSync(req.file.path);

    console.log(booking);

    res.status(200).json({ booking });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res
    .status(404)
    .json({ message: "path not found on this server #personal-project" });
});
app.use(errorMiddleware);
// sequelize.sync({ force: true });

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
