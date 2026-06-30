const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const modalidades = await db.query(
            "SELECT * FROM modalidades ORDER BY id"
        );

        res.json(modalidades.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json(erro);
    }
});

module.exports = router;