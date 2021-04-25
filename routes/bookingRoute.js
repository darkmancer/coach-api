
const express = require('express')
const bookingController = require('../controllers/bookingController')
const userController = require('../controllers/userController')
const router = express.Router();

router.get('/get-booking', userController.protect, bookingController.getAllBooking);
router.post('/create/:id', userController.protect, bookingController.createBooking)
// router.post('/', customerController.createCustomer);
router.put('/cancel/:id',userController.protect, bookingController.cancelBooking);
// router.delete('/:id', customerController.deleteCustomer);


module.exports  = router