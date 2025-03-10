const express = require("express");
const { getAllCierreCaja, createCierreCaja, updateCierreCaja, getCierreCaja ,deleteCierreCaja } = require("../controllers/cierreCajaController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:kioscoId", authenticate, getAllCierreCaja);
router.post("/:kioscoId", authenticate, createCierreCaja);
router.put("/:kioscoId/:cierreCajaId", authenticate, updateCierreCaja);
router.get("/:kioscoId/:cierreCajaId", authenticate, getCierreCaja)
router.delete("/:kioscoId/:cierreCajaId", authenticate, deleteCierreCaja);

module.exports = router;
