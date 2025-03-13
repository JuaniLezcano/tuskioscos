const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    let token = req.cookies?.token;
    
    // Si no hay token en las cookies, intentar obtenerlo del encabezado Authorization
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    } catch {
        res.status(401).json({ error: "Token inválido" });
    }
};
