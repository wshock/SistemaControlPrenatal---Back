
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Inicializaciones
const app = express();


// Settings
app.set("port",4000);


// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Rutas 
app.use(require("./routes/index.js"));
app.use(require("./routes/authentication.js"));
app.use("/madres",require("./routes/madres.js"));


// Iniciar servidor 
app.listen(app.get("port"));
console.log("Server iniciado en puerto "+app.get("port"));