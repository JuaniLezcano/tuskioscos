const prisma = require("../prisma/client");

exports.getKioscos = async (req, res) => {
    const { userId } = req;
    try {
        const kioscos = await prisma.kiosco.findMany({ where: { userId: userId } });
        res.json(kioscos);
    } catch(error) {
        res.status(500).json({ error: error.message || "Error obteniendo kioscos" });
    }
};

exports.getKiosco = async (req, res) => {
    const { userId } = req;
    const { kioscoId } = req.params;
    try {
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });

        if (!kiosco) {
            return res.status(404).json({ error: "Kiosco no encontrado" });
        }

        if (kiosco.userId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        }

        res.json(kiosco);
    } catch (error) {
        res.status(400).json({ error: error.message || "Error obteniendo el kiosco solicitado" })
    }
}

exports.createKiosco = async (req, res) => {
    const { userId } = req;
    const { name } = req.body;
    try {
        const newKiosco = await prisma.kiosco.create({
            data: {
                name: name,
                userId: parseInt(userId)
            }
        });
        res.json(newKiosco);
    } catch (error) {
        res.status(400).json({ error: error.message || "Error cargando el kiosco nuevo" })
    }
}

exports.updateKiosco = async (req, res) => {
    const { userId } = req
    const { kioscoId } = req.params;
    const { name } = req.body;
    try {
        // Verifico que el kiosco pertenece al usuario autenticado
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });
    
        if (!kiosco || kiosco.userId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        };

        const kioscoUpdated = await prisma.kiosco.update({
            where: { id: parseInt(kioscoId) },
            data: {
                name: name
            }
        })
        res.json(kioscoUpdated);
    } catch (error) {
        res.status(400).json({ error: error.message || "Error editando el kiosco" })
    }
}

exports.deleteKiosco = async (req, res) => {
    const { userId } = req;
    const { kioscoId } = req.params;
    try {
        // Verifico que el kiosco pertenece al usuario autenticado
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });
    
        if (!kiosco || kiosco.userId !== userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        };

        const kioscoDeleted = await prisma.$transaction([
            prisma.cierreCaja.deleteMany({
                where: { kioscoId: parseInt(kioscoId) }
            }),
            prisma.kiosco.delete({
                where: { id: parseInt(kioscoId) }
            })
        ]);
        
        res.json(kioscoDeleted);
    } catch (error) {
        res.status(400).json({ error: error.message || "Error eliminando el kiosco" })
    }
}