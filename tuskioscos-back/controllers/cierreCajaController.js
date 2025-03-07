const prisma = require("../prisma/client");

exports.getAllCierreCaja = async (req, res) => {
    const { kioscoId } = req.params;
    try {
        const cierreCaja = await prisma.cierreCaja.findMany({ where: { kioscoId: parseInt(kioscoId) } });
        res.json(cierreCaja);
    } catch {
        res.status(500).json({ error: "Error obteniendo los cierres de caja" });
    }
};

exports.createCierreCaja = async (req, res) => {
    const { kioscoId } = req.params;
    const { monto, fecha } = req.body;
    try {
        const cierreCaja = await prisma.cierreCaja.create({
            data: {
                monto,
                fecha,
                kioscoId: parseInt(kioscoId)
            },
        });
        res.json(cierreCaja);
    } catch (error) {
        error.message = "No se pudo realizar satisfactoriamente el cierre de caja"
        res.status(400).json({ error: error.message });
    }
}

exports.updateCierreCaja = async (req, res) => {
    const { kioscoId } = req.params;
    const { monto , fecha } = req.body
    try {
        const cierreCajaUpdated = await prisma.cierreCaja.update({ 
            where: { kioscoId: parseInt(kioscoId) },
            data: {
                monto,
                fecha
            },
        });
        res.json(cierreCajaUpdated)
    } catch (error) {
        error.message = "Hubo un error en la edicion del cierre de caja"
        res.status(400).json({ error: error.message })
    }
}