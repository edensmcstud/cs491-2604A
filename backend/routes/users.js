const express = require("express");
const router = express.Router();

const controller = require("../controllers/usersController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

// TEST ROUTE (no auth)
router.get("/test", controller.test);

router.post(
    "/",
    authEmployee,
    requireRole("admin"),
    requireFields(["username", "password_hash", "email"]),
    controller.createUser
);

router.get("/", authEmployee, requireRole("admin"), controller.getUsers);

router.get("/:id", authEmployee, requireRole("admin"), controller.getUser);

router.put(
    "/:id",
    authEmployee,
    requireRole("admin"),
    requireFields(["username", "email"]),
    controller.updateUser
);

router.delete("/:id", authEmployee, requireRole("admin"), controller.deleteUser);

module.exports = router;
