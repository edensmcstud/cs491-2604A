const express = require("express");
const router = express.Router();

const controller = require("../controllers/usersController");
const auth = require("../middleware/auth");              // NEW
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

// TEST ROUTE (no auth)
router.get("/test", controller.test);

// CREATE USER (admin only)
router.post(
    "/",
    auth,                                                // NEW
    requireRole("admin"),
    requireFields(["username", "password_hash", "email"]),
    controller.createUser
);

// GET ALL USERS
router.get("/", auth, requireRole("admin"), controller.getUsers);

// GET SINGLE USER
router.get("/:id", auth, requireRole("admin"), controller.getUser);

// UPDATE USER
router.put(
    "/:id",
    auth,
    requireRole("admin"),
    requireFields(["username", "email"]),
    controller.updateUser
);

// DELETE USER
router.delete("/:id", auth, requireRole("admin"), controller.deleteUser);

module.exports = router;
