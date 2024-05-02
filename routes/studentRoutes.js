const express = require("express");
const studentController = require("../controllers/studentController");
// const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", studentController.getAllStudents);
router.get("/:isbn", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:isbn", studentController.updateStudent);
router.delete("/:isbn", studentController.deleteStudent);
router

module.exports = router;
