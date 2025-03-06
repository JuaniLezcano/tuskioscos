const prisma = require("../prisma/client");

exports.getKioscos = async (req, res) => {
    try {
        const kioscos = await prisma.kiosco.findMany({ where: { userId: req.userId } });
        res.json(kioscos);
    } catch {
        res.status(500).json({ error: "Error obteniendo kioscos" });
    }
};
