const { Review } = require("../models");

exports.getAllReviews = async (req, res, next) => {
  try {
    const id = req.params.id; //coach id
    const reviews = await Review.findAll({ where: { coachId: id } });
    res.status(200).json({ message: "get reviews", reviews });
  } catch (er) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const coachId = req.params.id;
    const { reviewScore, review } = req.body;
    await Review.create({
      userId,
      coachId,
      reviewScore,
      review,
      status: "SHOWING",
    });
    res.status(201).json({ message: "review created" });
  } catch (err) {
    next(err);
  }
};

exports.noShow = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const review = Review.findOne({ where: { id } });

    if (review.userId != userId)
      return res
        .status(401)
        .json({ message: "can only delete your own review" }); //check if that user owns the review
    await Review.update({ status: "HIDING" }, { where: { id } });
    res.status(204).json({ message: "review removed fakely" });
  } catch (err) {
    next(err);
  }
};

exports.editReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { review, reviewScore } = req.body;
    const theReview = await Review.findOne({ where: { id } });
    console.log(userId, theReview.userId);
    if (theReview.userId != userId)
      return res
        .status(401)
        .json({ message: "can only update your own review" }); //check if that user owns the review
    await Review.update({ review, reviewScore }, { where: { id } });
    res.status(200).json({message: 'Review Edited'})
  } catch (err) {
    next(err);
  }
};
