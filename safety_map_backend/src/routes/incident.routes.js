const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/incident.controller");
const { protect, optionalAuth } = require("../middleware/auth");

router.get(  "/",          optionalAuth, controller.getAllIncidents);
router.get(  "/stats",                   controller.getStats);
router.get(  "/:id",       optionalAuth, controller.getIncident);
router.post( "/",          protect,      controller.createIncident);
router.patch("/:id",       protect,      controller.updateIncident);
router.delete("/:id",      protect,      controller.deleteIncident);
router.post( "/:id/upvote", protect,     controller.upvoteIncident);

module.exports = router;