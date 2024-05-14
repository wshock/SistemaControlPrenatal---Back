// Dependencias necesarias
const express = require('express');
const router = express.Router();
const path = require("path");

// Llamado a la funcion q conecta a la bd
const database = require("../database");


// Cuando se haga un get a la ruta :/gestantes/ se mostrala la página profPrincipal
router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profPrincipal.html'))
})

// Este método es para que express pueda servir todos los archivos relacionados con los html (css, js, img etc)
router.use("",express.static(path.join(__dirname, '../../../Front-End'), {

    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }

}));



// RUTAS PARA AÑADIR NUEVA MADRE/GESTACIÓN:


// Cuando se haga un get a la ruta :/gestantes/add se mostrará la página profReg-CarnePerinatal
router.get("/add", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/Sidebar/profSideBar.html'))
})

// Cuando se haga un post a la ruta :/gestantes/add se obtendrán los datos del formulario
// del DOM y se mandarán a la base de datos para guardarlos y registrar a la paciente
router.post("/add", async (req, res)=>{

    const { nombre, apellido, domicilio, localidad, correo, 
        fecha_nacimiento, edad, etnia, alfabeta, estudios, anosMayorNivel,
        estadoCivil, viveSola, lugarControlPrenatal, numeroIdentidad,
        tbcFamiliar, tbcPersonal, diabetesFamiliar, diabetesPersonal,
        hipertensionFamiliar, hipertensionPersonal, pre_eclampsiaFamiliar, pre_eclampsiaPersonal,
        otrosAntecedentesFamiliares, otrosAntecedentesPersonales, cirugiaPelvica, infertibilidad,
        vih, cardio_nefropatia, ectopicos, condicion_grave, gestasPrevias, gestasPreviasNumero,
        tuvoAbortos, abortosNumero, tresAbortosConsecutivos, tuvoPartos, partosNumero, pesoMenor2500g,
        pesoMayor4000g, partoMultiple, numeroPartosVaginales, numeroPartosCesarea, numeroNacidosVivos,
        numeroViven, muertos1semana, muertosdespues1semana, numeroNacidosMuertos } = req.body;

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
        lugarControlPrenatal,
        tbcFamiliar,
        tbcPersonal,
        diabetesFamiliar,
        diabetesPersonal,
        hipertensionFamiliar,
        hipertensionPersonal,
        pre_eclampsiaFamiliar,
        pre_eclampsiaPersonal,
        otrosAntecedentesFamiliares,
        otrosAntecedentesPersonales,
        cirugiaPelvica,
        infertibilidad,
        vih,
        cardio_nefropatia,
        ectopicos,
        condicion_grave, 
        gestasPrevias, 
        gestasPreviasNumero, 
        tuvoAbortos, 
        abortosNumero, 
        tresAbortosConsecutivos, 
        tuvoPartos, 
        partosNumero, 
        pesoMenor2500g, 
        pesoMayor4000g, 
        partoMultiple, 
        numeroPartosVaginales, 
        numeroPartosCesarea, 
        numeroNacidosVivos, 
        numeroViven, 
        muertos1semana, 
        muertosdespues1semana, 
        numeroNacidosMuertos
    }

    const connection = await database.getConnection();
    await connection.query("INSERT INTO pacientes set ?", [newMadre])
    res.send("received");
})




// RUTAS PARA LA BUSQUEDA Y LISTA DE GESTANTES:


// Cuando se haga un get a la ruta :/madres/list se mostrará la página profMadres.html
router.get("/list", (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profMadres.html'))
})

// Cuando se haga un get a la ruta :/gestantes/list/:id se hará una consulta a la base de datos
// para poder listar a las madres/gestaciones

router.get("/list/:id", async (req,res)=>{
    const { id } = req.params;
    const connection = await database.getConnection();
    const madres = await connection.query('SELECT * FROM pacientes WHERE numero_identidad = ?', [id])
    res.send(madres[0]);
})



// RUTAS PARA EL MANEJO DE MADRES/GESTACIONES EXISTENTES:


// Render de la vista para editar datos del form:
router.get("/edit/:id", async (req,res)=>{
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profEditSideBar.html'));
})

// Enviar datos de la madre para cargarlos en el front y poder editarlos
router.get("/edit/:id/reqInfo", async (req, res) => {
    const { id } = req.params;
    const connection = await database.getConnection();
    const pacienteEdit = await connection.query("SELECT * FROM pacientes WHERE id = ?", [id]);
    res.send(pacienteEdit[0][0])
}) 

// Enviar los nuevos datos y actualizarlos en la BD
router.post("/edit/:id", async (req, res) => {
    const { id } = req.params;

    const { nombre, apellido, domicilio, localidad, correo, 
        fecha_nacimiento, edad, etnia, alfabeta, estudios, anosMayorNivel,
        estadoCivil, viveSola, lugarControlPrenatal, numeroIdentidad,
        tbcFamiliar, tbcPersonal, diabetesFamiliar, diabetesPersonal,
        hipertensionFamiliar, hipertensionPersonal, pre_eclampsiaFamiliar, pre_eclampsiaPersonal,
        otrosAntecedentesFamiliares, otrosAntecedentesPersonales, cirugiaPelvica, infertibilidad,
        vih, cardio_nefropatia, ectopicos, condicion_grave, gestasPrevias, gestasPreviasNumero,
        tuvoAbortos, abortosNumero, tresAbortosConsecutivos, tuvoPartos, partosNumero, pesoMenor2500g,
        pesoMayor4000g, partoMultiple, numeroPartosVaginales, numeroPartosCesarea, numeroNacidosVivos,
        numeroViven, muertos1semana, muertosdespues1semana, numeroNacidosMuertos } = req.body;

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
        lugarControlPrenatal,
        tbcFamiliar,
        tbcPersonal,
        diabetesFamiliar,
        diabetesPersonal,
        hipertensionFamiliar,
        hipertensionPersonal,
        pre_eclampsiaFamiliar,
        pre_eclampsiaPersonal,
        otrosAntecedentesFamiliares,
        otrosAntecedentesPersonales,
        cirugiaPelvica,
        infertibilidad,
        vih,
        cardio_nefropatia,
        ectopicos,
        condicion_grave, 
        gestasPrevias, 
        gestasPreviasNumero, 
        tuvoAbortos, 
        abortosNumero, 
        tresAbortosConsecutivos, 
        tuvoPartos, 
        partosNumero, 
        pesoMenor2500g, 
        pesoMayor4000g, 
        partoMultiple, 
        numeroPartosVaginales, 
        numeroPartosCesarea, 
        numeroNacidosVivos, 
        numeroViven, 
        muertos1semana, 
        muertosdespues1semana, 
        numeroNacidosMuertos
    }

    const connection = await database.getConnection();
    await connection.query("UPDATE pacientes set ? WHERE id = ?",[editMadre, id])

    res.send("Success")
})





module.exports = router;