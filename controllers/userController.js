const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const client = new OAuth2Client(
  "168415094646-6d28j5ip6oojlqv418d7n061r2ipbfuj.apps.googleusercontent.com"
);
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

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "you are unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) return res.status(400).json({ message: "user not found" });
    req.user = user;
    console.log("protect works");
    next();
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, confirmPassword, email, discord } = req.body;

    console.log("body", req.body);
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password did not match" });
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      username,
      password: hashedPassword,
      email,
      discord,
      role: "USER",
    });
    res.status(201).json({ message: "register successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "username or password is incorrect" });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        discord: user.discord,
        avatar: user.avatar,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: +process.env.JWT_EXPIRES_IN,
      });
      res.status(200).json({ token, message: "login success" });
    } else {
      res.status(400).json({ message: "login failed" });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { email, discord, avatar } = req.body;
    await User.update(
      { email, discord, avatar },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ message: `update user success` });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res, next) => {
  const { id, email, avatar, username, discord } = req.user;
  res.status(200).json({
    user: {
      id,
      email,
      avatar,
      username,
      discord,
    },
  });
};

exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const isOldPasswordCorrect = await bcrypt.compare(
    oldPassword,
    req.user.password
  );
  if (!isOldPasswordCorrect)
    return res.status(400).json({ message: "password is incorrect" });
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  req.user.password = hashedPassword;
  await req.user.save();
  // await User.update({ password: hashedPassword }, { where: { username } });
  res.status(200).json({ message: "password Changed" });
};

exports.uploadAvatar = async (req, res, next) => {
  const { id } = req.user;
  try {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) return next(err);
      console.log(result);
      await User.update(
        {
          avatar: result.secure_url,
        },
        { where: { id } }
      );
      const user = await User.findOne({ where: { id } });
      fs.unlinkSync(req.file.path);
      res.status(200).json({ avatar: user.avatar });
    });
  } catch (e) {
    next(e);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const mappedUsers = users.map((user) => {
      return { username: user.username, userId: user.id };
    });
    res.status(200).json({ mappedUsers });
  } catch (err) {
    next(err);
  }
};

exports.googlelogin = async (req, res, next) => {
  try {
    console.log("this called");
    const { tokenId } = req.body;
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "168415094646-6d28j5ip6oojlqv418d7n061r2ipbfuj.apps.googleusercontent.com",
    });
    return res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
};
