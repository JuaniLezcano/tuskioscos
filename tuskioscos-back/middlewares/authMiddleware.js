const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    } catch {
        res.status(401).json({ error: "Token inválido" });
    }
};
