const express = require("express");
const router = express.Router();

const controller = require("../controllers/usersController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");
const requireFields = require("../middleware/requireFields");

// TEST ROUTE (no auth)
router.get("/test", controller.test);

// All real user routes require authentication
router.use(auth);

// CREATE USER (Admin + Employee)
router.post(
    "/",
    requirePermission("users", "create"),
    requireFields(["username", "password", "email"]),
    controller.createUser
);

// GET ALL USERS (Admin + Employee)
router.get(
    "/",
    requirePermission("users", "read"),
    controller.getUsers
);

// GET SINGLE USER (Admin + Employee)
router.get(
    "/:id",
    requirePermission("users", "read"),
    controller.getUser
);

// UPDATE USER (Admin + Employee)
router.put(
    "/:id",
    requirePermission("users", "update"),
    requireFields(["username", "email"]),
    controller.updateUser
);

// DELETE USER (Admin + Employee)
router.delete(
    "/:id",
    requirePermission("users", "delete"),
    controller.deleteUser
);

module.exports = router;
