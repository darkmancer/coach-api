const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
const { upload } = require("../middlewares/upload");
router.put("/", userController.protect, userController.updateUser);
router.get("/me", userController.protect, userController.me);
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
module.exports = router;
