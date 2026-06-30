// ===============================
// CONFIGURAÇÃO DA API
// ===============================

const API = "http://localhost:3000";

// ===============================
// ELEMENTOS DA TELA
// ===============================

const login = document.getElementById("login");
const dashboard = document.getElementById("dashboard");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");

const boasVindas = document.getElementById("boasVindas");

const lista = document.getElementById("lista");

const btnEntrar = document.getElementById("entrar");
const btnEnviar = document.getElementById("enviar");

// ===============================
// VARIÁVEIS
// ===============================

let usuario = null;

let bloqueado = false;

let modalidades = [];

let ordem = [];

// ===============================
// LOGIN
// ===============================

btnEntrar.addEventListener("click", async () => {

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nome || !email) {
        alert("Preencha Nome e E-mail.");
        return;
    }

    try {

        const resposta = await fetch(`${API}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email })
        });

        // Verifica se a resposta do servidor foi bem-sucedida (status 200-299)
        if (!resposta.ok) {
            throw new Error("Erro na requisição com o servidor");
        }

        usuario = await resposta.json();

        // Se tudo der certo, esconde o login
        login.classList.add("hidden");
        dashboard.classList.remove("hidden");

        boasVindas.innerHTML = `Olá, ${usuario.nome}`;

        await carregarModalidades();
        await verificarEnvio();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar ao servidor.");

    }

});

// ===============================
// BUSCA AS MODALIDADES DO BANCO
// ===============================

async function carregarModalidades() {

    try {

        const resposta = await fetch(`${API}/modalidades`);

        modalidades = await resposta.json();

        renderizar();

    } catch (erro) {

        console.error(erro);

    }

}

// ===============================
// VERIFICA SE O USUÁRIO
// JÁ ENVIOU AS PRIORIDADES
// ===============================

async function verificarEnvio() {

    try {

        const resposta = await fetch(`${API}/prioridades/${usuario.id}`);

        const dados = await resposta.json();

        if (dados.length > 0) {

            bloqueado = true;

            ordem = [];

            dados.forEach(item => {

                ordem.push(item.nome);

            });

        }

        renderizar();

    } catch (erro) {

        console.log(erro);

    }

}

// ===============================
// RENDERIZAÇÃO
// ===============================

function renderizar() {

    lista.innerHTML = "";

    let exibicao = [...modalidades];

    exibicao.sort((a, b) => {

        let pa = ordem.indexOf(a.nome);
        let pb = ordem.indexOf(b.nome);

        if (pa === -1) pa = 999;
        if (pb === -1) pb = 999;

        return pa - pb;

    });

    exibicao.forEach(modalidade => {

        const card = document.createElement("div");

        card.className = "modalidade";

        if (bloqueado)
            card.classList.add("bloqueado");

        const posicao = ordem.indexOf(modalidade.nome);

        card.innerHTML = `

            <span>${modalidade.nome}</span>

            ${posicao != -1
                ? `<span class="selo">${posicao + 1}º</span>`
                : ""
            }

        `;

        card.onclick = () => {

            if (bloqueado)
                return;

            if (ordem.includes(modalidade.nome))
                return;

            ordem.push(modalidade.nome);

            renderizar();

        };

        lista.appendChild(card);

    });

}

// ===============================
// ENVIAR PRIORIDADES
// ===============================

btnEnviar.addEventListener("click", async () => {

    if (bloqueado) {

        alert("Você já enviou suas prioridades.");

        return;

    }

    if (ordem.length !== modalidades.length) {

        alert("Classifique todas as modalidades.");

        return;

    }

    const prioridades = ordem.map((nome, indice) => {

        const modalidade = modalidades.find(m => m.nome === nome);

        return {

            modalidade: modalidade.id,

            ordem: indice + 1

        };

    });

    try {

        const resposta = await fetch(`${API}/prioridades`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                usuario_id: usuario.id,

                prioridades

            })

        });

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.mensagem);

            return;

        }

        bloqueado = true;

        renderizar();

        alert("Prioridades enviadas com sucesso!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao enviar prioridades.");

    }

});