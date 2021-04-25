const express = require("express");
const reviewController = require("../Controllers/reviewController");
const router = express.Router();
const userController = require("../Controllers/userController");

router.get("/:id", reviewController.getAllReviews);

router.put(
  "/update-review/:id",
  userController.protect,
  reviewController.editReview
);

router.post(
  "/create-review/:id",
  userController.protect,
  reviewController.createReview
);
router.put("/:id", userController.protect, reviewController.noShow);

module.exports = router;
