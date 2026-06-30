const express = require("express");

const router = express.Router();

const db = require("../db");


router.post("/", async (req, res) => {

    const {

        usuario_id,

        prioridades

    } = req.body;

    try {

        // Verifica se já enviou

        const existe = await db.query(

            "SELECT * FROM prioridades WHERE usuario_id=$1 LIMIT 1",

            [usuario_id]

        );

        if (existe.rows.length > 0) {

            return res.status(400).json({

                mensagem: "Usuário já enviou as prioridades."

            });

        }

        for (let i = 0; i < prioridades.length; i++) {

            await db.query(

                `INSERT INTO prioridades
                (usuario_id, modalidade_id, prioridade, enviado)
                VALUES ($1,$2,$3,true)`,

                [

                    usuario_id,

                    prioridades[i].modalidade,

                    prioridades[i].ordem

                ]

            );

        }

        res.json({

            mensagem: "Prioridades salvas."

        });

    } catch (erro) {

        res.status(500).json(erro);

    }

});



router.get("/:id", async (req, res) => {

    const usuario = req.params.id;

    const dados = await db.query(

        `SELECT

m.nome,

p.prioridade

FROM prioridades p

JOIN modalidades m

ON p.modalidade_id=m.id

WHERE usuario_id=$1

ORDER BY prioridade`,

        [usuario]

    );

    res.json(dados.rows);

});

module.exports = router;