const express = require("express");
const bookController = require("../controllers/bookController");
// const bodyParser = require("body-parser");
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", bookController.getAllBooks);
router.get("/:isbn", bookController.getBookById);
router.post("/", bookController.createBook);
router.put("/:isbn", bookController.updateBook);
router.delete("/:isbn", bookController.deleteBook);

module.exports = router;
