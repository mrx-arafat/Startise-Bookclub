const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");
const bookRoutes = require("./books");

// Use route modules
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test API endpoint
 *     description: Returns a test message to verify the API is working
 *     responses:
 *       200:
 *         description: Test message
 */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working correctly!",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
