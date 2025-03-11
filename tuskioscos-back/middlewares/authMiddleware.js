const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ error: "Token requerido" });

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    } catch {
        res.status(401).json({ error: "Token inválido" });
    }
};
