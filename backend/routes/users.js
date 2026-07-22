const express = require("express");
const router = express.Router();

const controller = require("../controllers/usersController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

// TEST ROUTE (no auth)
router.get("/test", controller.test);

// All real user routes require Admin
router.use(auth);
router.use(requireRole("Admin"));

// CREATE USER
router.post(
    "/",
    requireFields(["username", "password", "email"]),
    controller.createUser
);

// GET ALL USERS
router.get("/", controller.getUsers);

// GET SINGLE USER
router.get("/:id", controller.getUser);

// UPDATE USER
router.put(
    "/:id",
    requireFields(["username", "email"]),
    controller.updateUser
);

// DELETE USER
router.delete("/:id", controller.deleteUser);

module.exports = router;
