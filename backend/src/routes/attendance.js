const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const ctrl    = require("../controllers/attendanceController");

router.use(auth);
router.get  ("/",              ctrl.getAttendance);
router.get  ("/summary",       ctrl.getSummary);
router.get  ("/student/:id",   ctrl.studentHistory);
router.post ("/bulk",          ctrl.bulkMark);
router.patch("/:id",           ctrl.updateOne);

module.exports = router;
