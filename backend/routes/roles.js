const express = require("express");
const router = express.Router();

const controller = require("../controllers/rolesController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

router.post(
    "/assign",
    authEmployee,
    requireRole("admin"),
    requireFields(["user_id", "role_id"]),
    controller.assignRole
);

router.get("/", authEmployee, requireRole("admin"), controller.getRoles);

router.get("/test", controller.test);

module.exports = router;
