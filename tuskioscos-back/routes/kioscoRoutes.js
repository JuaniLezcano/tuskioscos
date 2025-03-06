const express = require("express");
const { getKioscos } = require("../controllers/kioscoController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getKioscos);

module.exports = router;
