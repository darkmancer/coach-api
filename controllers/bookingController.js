const { Booking } = require("../models");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: "darkmancer",
  api_key: "111775957868488",
  api_secret: "lLvvfpZzG44eKd-n1mxBPGXRIN8",
});


exports.getAllBooking = async (req, res, next) => {
  try {
    const id = req.user.id;
    const bookings = await Booking.findAll({ where: { userId: id } });
    res.status(200).json({ bookings });
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const coachId = req.params.id;
    console.log(userId, coachId);
    const { bookingTime, transactionId, game } = req.body;
    await Booking.create({
      userId,
      coachId,
      bookingTime,
      transactionId,
      game,
      status: "BOOKED",
    });
    res.status(201).json({ message: "booking created" });
  } catch (err) {
    next(err);
  }
};
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params; //booking id
    await Booking.update({ status: "CANCELED" }, { where: { id } });
    res.status(200).json({ message: "booking canceled" });
  } catch (err) {
    next(err);
  }
};

exports.completeCourse = async(req,res,next) => {
    try{
        const{id} = req.params; //
        await Booking.update({status:"COMPLETED"}, {wheer:{id}})
        res.status(200).json({ message: "course completed" });
    } catch(err){
        next(err)
    }
}
