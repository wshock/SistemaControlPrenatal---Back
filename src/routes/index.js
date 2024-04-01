
// Inicializar mi router
const express = require('express');
const path = require('path');
const router = express.Router();

// Llamado a la funcion q conecta a la bd
const database = require("../database");

router.get("/", (req,res) => {
    res.send("Entrando en ventana principal")
})

router.use("",express.static(path.join(__dirname, '../../../Front-End')));

router.get("/inicio", (req,res) =>{
    res.sendFile(path.join(__dirname, '../../../Front-End/index.html'))
})


router.post("/login", async (req,res) => {

    const { user, password, tipoUser } = req.body;

    const connection = await database.getConnection();
    const result = await connection.query("SELECT * FROM users WHERE nombre = ? AND password = ? AND tipo_user = ?", [user, password, tipoUser]);

    if (result[0].length > 0) {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
        res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

})

router.get("/login", async (req,res) => {
    const connection = await database.getConnection();
})

module.exports = router;