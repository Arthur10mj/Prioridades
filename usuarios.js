const express = require("express");

const router = express.Router();

const db = require("../db");


router.post("/", async (req, res) => {

    const { nome, email } = req.body;

    try {

        let usuario = await db.query(

            "SELECT * FROM usuarios WHERE email=$1",

            [email]

        );

        if (usuario.rows.length == 0) {

            usuario = await db.query(

                "INSERT INTO usuarios(nome,email) VALUES($1,$2) RETURNING *",

                [nome, email]

            );

        }

        res.json(usuario.rows[0]);

    } catch (erro) {

        res.status(500).json(erro);

    }

});

module.exports = router;