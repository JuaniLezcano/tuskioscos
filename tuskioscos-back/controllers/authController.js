const prisma = require("../prisma/client");
const { hashPassword, comparePassword, generateToken } = require("../services/authService");

// Register de User
app.post("/register", async (req, res) => {
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
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }});

// Login de User
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const valid = comparePassword(password, user.password);
    if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user.id);
    res.json({ token });
});