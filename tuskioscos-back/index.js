require("dotenv").config();
const express = require('express')
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express() // Instancia de express
const prisma = new PrismaClient(); // Instancia de prisma
const port = process.env.PORT || 5000; // Puerto de la app

app.use(express.json()); // Middleware para parsear el body de las peticiones
app.use(cors()); // Middleware para habilitar CORS

// Register de User
app.post("/register", async (req, res) => {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña
    try {
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
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
});

// Get kioscos de user logueado

app.get("/kioscos", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del header de la petición 
    
    if (!token) return res.status(401).json({ error: "Token requerido" });
  
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const kioscos = await prisma.kiosco.findMany({ where: { userId: userId } });
      res.json(kioscos);
    } catch {
      res.status(401).json({ error: "Token inválido", token });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})