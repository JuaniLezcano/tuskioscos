require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const kioscoRoutes = require("./routes/kioscoRoutes");
const cierreCajaRoutes = require("./routes/cierreCajaRoutes");
const express = require('express');
const cors = require("cors");

const app = express() // Instancia de express
const port = process.env.PORT || 5000; // Puerto de la app

app.use(express.json()); // Middleware para parsear el body de las peticiones
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
})); // Middleware para habilitar CORS

app.use("/user", userRoutes); // Rutas de autenticación
app.use("/kioscos", kioscoRoutes); // Rutas de kioscos
app.use("/cierreCaja", cierreCajaRoutes); // Rutas de cierre de cajas

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})