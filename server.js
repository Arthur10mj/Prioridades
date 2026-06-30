require("dotenv").config();

const express = require("express");
const cors = require("cors");

const usuarios = require("./routes/usuarios");
const prioridades = require("./routes/prioridades");
const modalidades = require("./routes/modalidades");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarios);
app.use("/prioridades", prioridades);
app.use("/modalidades", modalidades);

app.listen(process.env.PORT, () => {
    console.log("Servidor rodando na porta " + process.env.PORT);
});