const express = require("express");
const { getAllCierreCaja, createCierreCaja, updateCierreCaja } = require("../controllers/cierreCajaController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:kioscoId", authenticate, getAllCierreCaja);
router.post("/:kioscoId", authenticate, createCierreCaja)
router.put("/:kioscoId", authenticate, updateCierreCaja)

module.exports = router;
