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

    const { nombre, apellido, tipoDocumento, domicilio, localidad, correo, 
        fecha_nacimiento, edad, etnia, alfabeta, estudios, anosMayorNivel,
        estadoCivil, viveSola, lugarControlPrenatal, numeroIdentidad, regimen, eps,
        tbcFamiliar, tbcPersonal, diabetesFamiliar, diabetesPersonal,
        hipertensionFamiliar, hipertensionPersonal, pre_eclampsiaFamiliar, pre_eclampsiaPersonal,
        otrosAntecedentesFamiliares, otrosAntecedentesPersonales, cirugiaPelvica, infertibilidad,
        vih, cardio_nefropatia, ectopicos, condicion_grave, gestasPrevias, gestasPreviasNumero,
        tuvoAbortos, abortosNumero, tresAbortosConsecutivos, tuvoPartos, partosNumero, pesoMenor2500g,
        pesoMayor4000g, partoMultiple, numeroPartosVaginales, numeroPartosCesarea, numeroNacidosVivos,
        numeroViven, muertos1semana, muertosdespues1semana, numeroNacidosMuertos, planeadoODeseado, usabaAnticonceptivo,
        barrera, DIU, hormonal, emergencia, ligadura, otro } = req.body;

    const newMadre = {
        nombres: nombre,
        apellidos: apellido,
        tipoDocumento,
        numero_identidad:numeroIdentidad,
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
        correo,
        lugarControlPrenatal,
        regimen,
        eps,
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
        numeroNacidosMuertos,
        planeadoODeseado, 
        usabaAnticonceptivo,
        barrera, 
        DIU, 
        hormonal, 
        emergencia, 
        ligadura, 
        otro
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

    const { nombre, apellido, tipoDocumento, domicilio, localidad, correo, 
        fecha_nacimiento, edad, etnia, alfabeta, estudios, anosMayorNivel,
        estadoCivil, viveSola, lugarControlPrenatal, numeroIdentidad, regimen, eps,
        tbcFamiliar, tbcPersonal, diabetesFamiliar, diabetesPersonal,
        hipertensionFamiliar, hipertensionPersonal, pre_eclampsiaFamiliar, pre_eclampsiaPersonal,
        otrosAntecedentesFamiliares, otrosAntecedentesPersonales, cirugiaPelvica, infertibilidad,
        vih, cardio_nefropatia, ectopicos, condicion_grave, gestasPrevias, gestasPreviasNumero,
        tuvoAbortos, abortosNumero, tresAbortosConsecutivos, tuvoPartos, partosNumero, pesoMenor2500g,
        pesoMayor4000g, partoMultiple, numeroPartosVaginales, numeroPartosCesarea, numeroNacidosVivos,
        numeroViven, muertos1semana, muertosdespues1semana, numeroNacidosMuertos, planeadoODeseado, usabaAnticonceptivo,
        barrera, DIU, hormonal, emergencia, ligadura, otro } = req.body;

    const editMadre = {
        nombres: nombre,
        apellidos: apellido,
        tipoDocumento,
        numero_identidad:numeroIdentidad,
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
        correo,
        lugarControlPrenatal,
        regimen,
        eps,
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
        numeroNacidosMuertos,
        planeadoODeseado, 
        usabaAnticonceptivo,
        barrera, 
        DIU, 
        hormonal, 
        emergencia, 
        ligadura, 
        otro
    }

    const connection = await database.getConnection();
    await connection.query("UPDATE pacientes set ? WHERE id = ?",[editMadre, id])

    res.send("Success")
})


// rutas para agregar consultas (agregar/listar):

// Mostrar vista del formulario de consulta:
router.get("/edit/:id/Consulta", async (req, res) => {
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profNuevaConsulta.html'))
})

// Guardar en la base de datos la consulta de la gestante correspondiente: (Relacionar tabla 'pacientes' y 'consultas'):
router.post("/edit/:id/Consulta", async (req, res)=>{

    const { id } = req.params;

    const { fecha_registro, edad_gestacional, presion_arterial,
        altura_uterina, presentacion, fcf, movimientos_fetales, hierro,
        acido_folico, calcio, comentarios } = req.body;

    const consultaNueva = {
        idPaciente: id,
        fecha_registro, 
        edad_gestacional, 
        presion_arterial,
        altura_uterina, 
        presentacion, 
        fcf, 
        movimientos_fetales, 
        hierro,
        acido_folico, 
        calcio, 
        comentarios
    }
    const connection = await database.getConnection();
    await connection.query("INSERT INTO consultas set ?", [consultaNueva])
    res.send("Success");
})

// Pedirle a la BD los datos de todas las consultas de la paciente según su ID para listarlas en el front.
router.get("/edit/:id/listarConsultas", async (req,res) => {
    const { id } = req.params;
    const connection = await database.getConnection();
    const consultas = await connection.query('SELECT * FROM consultas WHERE idPaciente = ?', [id])
    res.send(consultas[0]);
})

router.get("/edit/:id/:idConsulta", async (req, res) => {
    res.sendFile(path.join(__dirname, '../../../Front-End/pages/Profesional/profConsultaMadre.html'));
})

router.get("/edit/:id/:idConsulta/info", async (req, res) => {
    const { idConsulta } = req.params;
    const connection = await database.getConnection();
    const consultas = await connection.query("SELECT * FROM consultas WHERE idConsultas = ?", [idConsulta]);
    res.send(consultas[0]);
})




module.exports = router;