const express = require("express");
const passport = require("passport");
const userController = require("../Controllers/userController");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const authMid = passport.authenticate("jwt", { session: false });
router.put("/", userController.protect, userController.updateUser);
router.get("/me", authMid, userController.me);
router.get("/allUsers", userController.getAllUsers);
router.put(
  "/changepassword",
  userController.protect,
  userController.changePassword
);
router.put(
  "/upload-avatar",
  userController.protect,
  upload.single("image"),
  userController.uploadAvatar
);

router.post("/googlelogin", userController.googlelogin);
module.exports = router;
