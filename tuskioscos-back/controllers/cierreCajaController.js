const prisma = require("../prisma/client");
const { parseDate } = require ("../services/dateService")

exports.getAllCierreCaja = async (req, res) => {
    const { kioscoId } = req.params;
    try {
        // Verifico que el kiosco pertenece al usuario autenticado
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });
    
        if (!kiosco || kiosco.userId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        }

        const cierreCaja = await prisma.cierreCaja.findMany({ where: { kioscoId: parseInt(kioscoId) } });
        res.json(cierreCaja);
    } catch (error) {
        res.status(400).json({ error: error.message || "Error obteniendo los cierres de caja" });
    }
};

exports.createCierreCaja = async (req, res) => {
    const { kioscoId } = req.params;
    const { monto, fecha } = req.body;

    if (!monto || isNaN(monto) || monto < 0) {
        return res.status(400).json({ error: "Monto inválido" });
    }

    try {
        // Verifico que el kiosco pertenece al usuario autenticado
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });
    
        if (!kiosco || kiosco.userId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        }
    
        const fechaParseada = parseDate(fecha);
        const cierreCaja = await prisma.cierreCaja.create({
            data: {
                monto: parseFloat(monto),
                fecha: fechaParseada,
                kioscoId: parseInt(kioscoId)
            },
        });
        res.json(cierreCaja);
    } catch (error) {
        res.status(400).json({ error: error.message || "No se pudo realizar satisfactoriamente el cierre de caja" });
    }
}

exports.updateCierreCaja = async (req, res) => {
    const { cierreCajaId } = req.params;
    const { monto , fecha } = req.body

    // Verifico que el cierre de caja tenga un id valido
    if (!cierreCajaId || isNaN(cierreCajaId)) {
        return res.status(400).json({ error: "ID del cierre de caja inválido" });
    }
    // Verifico el monto
    if (!monto || isNaN(monto) || monto < 0) {
        return res.status(400).json({ error: "Monto inválido" });
    }

    try {
        // Verifico que el cierre de caja exista en la base de datos
        const cierreCaja = await prisma.cierreCaja.findUnique({
            where: { id: parseInt(cierreCajaId) },
            include: { kiosco: true }
        });

        // Verifico que el cierre de caja le pertenezca al usuario dueño del kiosco
        if (!cierreCaja || cierreCaja.kiosco.userId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para modificar este cierre de caja" });
        }

        const cierreCajaUpdated = await prisma.cierreCaja.update({ 
            where: { id: parseInt(cierreCajaId) },
            data: {
                monto,
            },
        });
        res.json(cierreCajaUpdated)
    } catch (error) { 
        res.status(400).json({ error: error.message || "Hubo un error en la edicion del cierre de caja" })
    }
}

exports.getCierreCaja = async (req, res) => {
    const { kioscoId, cierreCajaId } = req.params

    try {
        // Verifico que el kiosco pertenece al usuario autenticado
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });
    
        if (!kiosco || kiosco.userId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        }

        // Verifico que el cierre de caja exista en la base de datos
        const cierreCajaExist = await prisma.cierreCaja.findUnique({
            where: { id: parseInt(cierreCajaId) },
            include: { kiosco: true }
        });

        // Verifico que el cierre de caja le pertenezca al usuario dueño del kiosco
        if (!cierreCajaExist || cierreCajaExist.kiosco.userId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este cierre de caja" });
        }

        const cierreCaja = await prisma.cierreCaja.findUnique({
            where: { id: parseInt(cierreCajaId) },
        });
        res.json(cierreCaja)
    } catch (error) {
        res.status(400).json({ error: error.message || "Hubo un error al obtener el cierre de caja" })        
    }

}

exports.deleteCierreCaja = async (req, res) => {
    const { kioscoId, cierreCajaId } = req.params;

    try {

        // Verifico que el kiosco pertenece al usuario autenticado
        const kiosco = await prisma.kiosco.findUnique({
            where: { id: parseInt(kioscoId) },
        });

        if (!kiosco || kiosco.userId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este kiosco" });
        }
        
        // Verifico que el cierre de caja pertenezca al kiosco
        const cierreCaja = await prisma.cierreCaja.findUnique({
            where: { id: parseInt(cierreCajaId) },
        });

        if (!cierreCaja || cierreCaja.kioscoId !== parseInt(kioscoId)) {
            return res.status(404).json({ error: "Cierre de caja no encontrado o no pertenece a este kiosco" });
        }

        const cierreCajaDeleted = await prisma.cierreCaja.delete({
            where: { id: parseInt(cierreCajaId) },
        });

        res.json(cierreCajaDeleted);
    } catch (error) {
        res.status(400).json({ error: error.message || "Hubo un error en la eliminacion del cierre de caja" });
    }
};