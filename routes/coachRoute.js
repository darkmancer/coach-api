const express = require("express");
const coachController = require("../Controllers/coachController");
const router = express.Router();

router.get("/", coachController.getAllCoaches);
router.post("/create-coach", coachController.createCoach);
router.put("/:id", coachController.updateCoach);
router.delete("/:id", coachController.deleteCoach);
router.get("/getCoachByGame/:game", coachController.getAllCoachesGame);
router.get("/:id", coachController.getCoach);

module.exports = router;
