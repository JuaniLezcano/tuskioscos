const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
