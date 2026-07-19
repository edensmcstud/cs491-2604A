const express = require("express");
const router = express.Router();

const controller = require("../controllers/booksController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

router.get("/test", controller.test);

router.post(
    "/",
    authEmployee,
    requireRole("admin"),
    requireFields(["isbn", "title", "author", "price"]),
    controller.createBook
);

router.get("/", authEmployee, controller.getBooks);

module.exports = router;
