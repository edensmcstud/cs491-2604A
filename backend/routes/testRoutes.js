const express = require("express");
const router = express.Router();
const controller = require("../controllers/testController");

// Only allow in development
router.use((req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Test API disabled in production" });
    }
    next();
});

router.get("/db-state", controller.dbState);
router.post("/seed", controller.seed);
router.post("/cleanup", controller.cleanup);
router.get("/ping", controller.ping);

module.exports = router;
