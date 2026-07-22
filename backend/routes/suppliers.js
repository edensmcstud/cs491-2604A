const express = require("express");
const router = express.Router();

const controller = require("../controllers/suppliersController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// All supplier routes require Admin
router.use(auth);
router.use(requireRole("Admin"));

router.post("/", controller.createSupplier);
router.get("/", controller.getSuppliers);
router.get("/:id", controller.getSupplier);
router.put("/:id", controller.updateSupplier);
router.delete("/:id", controller.deleteSupplier);

module.exports = router;
