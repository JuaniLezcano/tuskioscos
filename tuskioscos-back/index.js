require("dotenv").config();
const express = require('express')
const cors = require("cors");

const app = express() // Instancia de express
const port = process.env.PORT || 5000; // Puerto de la app

app.use(express.json()); // Middleware para parsear el body de las peticiones
app.use(cors()); // Middleware para habilitar CORS

app.use("/auth", authRoutes);
app.use("/kioscos", kioscoRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})