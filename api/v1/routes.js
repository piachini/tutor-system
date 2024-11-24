const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/velocita", controller.getAvgSpeeds);
router.get("/infrazioni", controller.getInfringments);
router.post("/passaggi", controller.addTransit);


module.exports = router;