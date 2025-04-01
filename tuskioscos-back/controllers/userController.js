const prisma = require("../prisma/client");
const { hashPassword, comparePassword, generateToken } = require("../services/authService");

// Register de User
exports.register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
            });
        res.json({userId: user.id, email: user.email, name: user.name});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }};

// Login de User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const valid = await comparePassword(password, user.password);
    
    if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({ success: true, message: "Login exitoso", token: token });
};

exports.logout = (req, res) => {
    res.json({ success: true, message: "Logout exitoso" });
};

exports.infoUser = async (req, res) => {
    const { userId } = req
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(userId)
        }
    })
    
    res.json(user);
}