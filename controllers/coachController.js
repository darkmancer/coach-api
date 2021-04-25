const { Coach } = require("../models");

exports.getCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coach = await Coach.findOne({ where: { id } });
    res.status(200).json({ message: "coach existed", coach });
  } catch (err) {
    next(err);
  }
};

exports.getAllCoachesGame = async (req, res, next) => {
  try {
    const { game } = req.params;

    console.log(game);

    const coaches = await Coach.findAll({ where: { game } });

    res.status(200).json({ message: "coaches existed", coaches });
  } catch (err) {
    next(err);
  }
};
exports.getAllCoaches = async (req, res, next) => {
  try {
    const coaches = await Coach.findAll();
           
    res.status(200).json({ message: "coaches", coaches });
  } catch (err) {
    next(err);
  }
};

exports.createCoach = async (req, res, next) => {
  try {
    const { username, discord, rank, achievement, about, game } = req.body;
    await Coach.create({
      username,
      discord,
      rank,
      achievement,
      about,
      game,
    });
    res.status(201).json({ message: "Coach Created" });
  } catch (err) {
    next(err);
  }
};

exports.updateCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { discord, avatar, rank, achievement, about, game } = req.body;
    await Coach.update(
      { discord, avatar, rank, achievement, about, game },
      { where: { id } }
    );
    res.status(200).json({ message: `Coach Updated` });
  } catch (err) {
    next(err);
  }
};

exports.deleteCoach = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Coach.destroy({ where: { id } });
    res.status(204);
  } catch (err) {
    next(err);
  }
};
