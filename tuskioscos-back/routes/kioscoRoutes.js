const express = require("express");
const { getKioscos, getKiosco, createKiosco, updateKiosco, deleteKiosco } = require("../controllers/kioscoController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getKioscos);
router.get("/:kioscoId", authenticate, getKiosco);
router.post("/", authenticate, createKiosco);
router.put("/:kioscoId", authenticate, updateKiosco);
router.delete("/:kioscoId", authenticate, deleteKiosco);

module.exports = router;
