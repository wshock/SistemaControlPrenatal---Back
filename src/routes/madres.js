// Dependencias necesarias
const express = require('express');
const router = express.Router();
const path = require("path");

// Llamado a la funcion q conecta a la bd
const database = require("../database");



// Cuando se haga un get a la ruta :/madres/ se mostrala la página profPrincipal
router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profPrincipal.html'))
})

// Este método es para que express pueda servir todos los archivos relacionados con los html (css, js, img etc)
router.use("",express.static(path.join(__dirname, '../../../Front-End')));


// Cuando se haga un get a la ruta :/madres/add se mostrará la página profReg-CarnePerinatal
router.get("/add", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profReg-CarnePerinatal.html'))
})

// Cuando se haga un get a la ruta :/madres/list/MadresList se hará una consulta a la base de datos
// para poder listar a las madres
router.get("/list/MadresList", async (req,res)=>{
    const connection = await database.getConnection();
    const madres = await connection.query('SELECT * FROM pacientes')
    res.send(madres[0]);
})

// Cuando se haga un get a la ruta :/madres/list se mostrará la página profMadres.html
router.get("/list", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profMadres.html'))
})

// Cuando se haga un get a la ruta :/madres/list/delete/:id se eliminará el objeto
// directamente de la base de datos
router.get("/list/delete/:id", async (req, res) => {
    
    const { id } = req.params;
    const connection = await database.getConnection();
    await connection.query("DELETE FROM pacientes WHERE id = ?", [id]);

    res.redirect("/madres/list")
})

// Cuando se haga un get a la ruta :/madres/list/edit/:id se redireccionará a una vista
// nueva para editar los datos de la madre
router.get("/list/edit/:id/", async (req, res) => {
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profEditMadre.html'));
})

// get que se ejecuta cuando se redirecciona a la nueva vista para editar los datos de la madre
// sirve los datos actuales de la madre para que la profesional los modifique a través del formulario
router.get("/list/edit/:id/reqInfo", async (req, res) => {
    const { id } = req.params;
    const connection = await database.getConnection();
    const pacienteEdit = await connection.query("SELECT * FROM pacientes WHERE id = ?", [id]);
    res.send(pacienteEdit[0][0])
}) 

// post que envía y modifica los datos editados de la madre a la base de datos
router.post("/list/edit/:id/", async (req, res) => {
    const { id } = req.params;

    const { nombre, apellido, domicilio, localidad, correo, 
        fecha_nacimiento, edad, etnia, alfabeta, estudios, anosMayorNivel,
         estadoCivil, viveSola, lugarControlPrenatal, numeroIdentidad } = req.body;

    const editMadre = {
        nombres: nombre,
        apellidos: apellido,
        domicilio,
        localidad,
        fecha_nacimiento,
        edad,
        etnia,
        alfabeta,
        estudios,
        anos_mayor_nivel:anosMayorNivel,
        estado_civil:estadoCivil,
        vive_sola:viveSola,
        numero_identidad:numeroIdentidad,
        correo,
        lugarControlPrenatal
    }
    const connection = await database.getConnection();
    await connection.query("UPDATE pacientes set ? WHERE id = ?",[editMadre, id])

    res.send("Success")
})


// Cuando se haga un post a la ruta :/madres/add se obtendrán los datos del formulario
// del DOM y se mandarán a la base de datos para guardarlos y registrar a la paciente
router.post("/add", async (req, res)=>{
    const { nombre, apellido, domicilio, localidad, correo, 
        fecha_nacimiento, edad, etnia, alfabeta, estudios, anosMayorNivel,
         estadoCivil, viveSola, lugarControlPrenatal, numeroIdentidad } = req.body;

    const newMadre = {
        nombres: nombre,
        apellidos: apellido,
        domicilio,
        localidad,
        fecha_nacimiento,
        edad,
        etnia,
        alfabeta,
        estudios,
        anos_mayor_nivel:anosMayorNivel,
        estado_civil:estadoCivil,
        vive_sola:viveSola,
        numero_identidad:numeroIdentidad,
        correo,
        lugarControlPrenatal
    }

    const connection = await database.getConnection();
    await connection.query("INSERT INTO pacientes set ?", [newMadre])
    res.send("received");
})

// empezando parte de .C.rud mysql


module.exports = router;