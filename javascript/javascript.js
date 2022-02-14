let nomeUsuario = prompt("Qual o seu nome?");
const chat = document.querySelector("main");

const nome = {
  name: nomeUsuario
};

cadastrarUsuario();

function cadastrarUsuario() {
  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/participants",
    nome
  );

  promessa.then(usuarioCadastrado);
  promessa.catch(usuarioNaoCadastrado);
}

function usuarioCadastrado() {}

// error-404
function usuarioNaoCadastrado() {
  const fundoEscuro = document.querySelector(".fundo-escuro");
  const error404 = document.querySelector(".error-400");

  fundoEscuro.classList.remove("escondido");
  error404.classList.remove("escondido");

  setTimeout(() => {
    window.location.reload();
  }, 5000);
}

setInterval(manterConexaoDoUsuario, 5000);

function manterConexaoDoUsuario() {
  axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome);
}

mostrarMensagens();

setInterval(mostrarMensagens, 3000);

function mostrarMensagens() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/messages"
  );

  promessa.then(buscarMensagens);
}

function buscarMensagens(mensagens) {
  chat.innerHTML = "";

  for (let i = 0; i < mensagens.data.length; i++) {
    if (mensagens.data[i].type === "status") {
      chat.innerHTML += `
            <span data-identifier="message" class="mensagem__usuario-entrou"><p>(${mensagens.data[i].time}) <strong>&nbsp${mensagens.data[i].from}&nbsp</strong>  ${mensagens.data[i].text}</p></span>
            `;
    } else if (mensagens.data[i].type === "message") {
      chat.innerHTML += `
            <span data-identifier="message" class="mensagem"><p>(${mensagens.data[i].time}) <strong>&nbsp${mensagens.data[i].from}&nbsp</strong> para <strong>&nbsp${mensagens.data[i].to}</strong>: ${mensagens.data[i].text}</p></span>
            `;
    } else if (
      mensagens.data[i].to === nomeUsuario ||
      mensagens.data[i].from === nomeUsuario
    ) {
      chat.innerHTML += `
            <span data-identifier="message" class="mensagem__privada"><p>(${mensagens.data[i].time}) <strong>&nbsp${mensagens.data[i].from}&nbsp</strong> reservadamente para <strong>&nbsp${mensagens.data[i].to}</strong>: ${mensagens.data[i].text}</p></span>
            `;
    } else {
    }

    scrollarAteUltimaMensagem();
  }
}

function scrollarAteUltimaMensagem() {
  const ultimaMensagem = document.querySelector("span:last-of-type");
  ultimaMensagem.scrollIntoView();
}
// enviar mensagem
function enviarTexto() {
  const publico = document.querySelector("aside span");
  console.log(publico);

  if (publico.classList.contains("selecionado")) {
    privacidadeDaMensagem = "message";
  } else {
    privacidadeDaMensagem = "private_message";
  }

  mensagem = {
    from: nomeUsuario,
    to: contatoSelecionado,
    text: document.querySelector("footer input").value,
    type: privacidadeDaMensagem
  };

  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v4/uol/messages",
    mensagem
  );

  promessa.then(mensagemEnviada);
  promessa.catch(mensagemNaoenviada);
}

function mensagemEnviada() {
  document.querySelector("footer input").value = "";
  mostrarMensagens();
}

// falha de envio
function mensagemNaoenviada() {
  window.location.reload();
}

function habilitarBarraLateral() {
  const fundoEscuro = document.querySelector(".fundo-escuro");
  const barraLateral = document.querySelector("aside");

  fundoEscuro.classList.remove("escondido");
  barraLateral.classList.remove("escondido");
}

function voltarParaChat() {
  const fundoEscuro = document.querySelector(".fundo-escuro");
  const barraLateral = document.querySelector("aside");

  fundoEscuro.classList.add("escondido");
  barraLateral.classList.add("escondido");
}

mostrarParticipantes();

setInterval(mostrarParticipantes, 10000);

function mostrarParticipantes() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v4/uol/participants"
  );

  promessa.then(carregarParticipantes);
}

function verificarConexaoDoContato(contatos) {
  let count = 0;
  for (let i = 0; i < contatos.data.length; i++) {
    if (contatoSelecionado === contatos.data[i].name) {
      count++;
    } else {
    }
  }
  if (count === 0 && contatoSelecionado !== "Todos") {
    document.querySelector("footer input").value = "";

    const aviso = document.querySelector(".usuario-saiu");

    aviso.innerHTML = `
        Usuário <strong>${contatoSelecionado}</strong> deixou a sala.
        `;
    aviso.classList.remove("escondido");
    setTimeout(() => {
      aviso.classList.add("escondido");
    }, 3000);

    contatoSelecionado = "Todos";
  } else {
  }
}
// carregar participantes
function carregarParticipantes() {
  const contatos = document.querySelector(".contatos");

  verificarConexaoDoContato(participantes);

  if (contatoSelecionado === "Todos") {
    contatos.innerHTML = `
    <div data-identifier="participant" class="selecionado">
        <img src="icons/persons.svg" alt="pessoas">
        <p>Todos</p>
    </div>
    `;
  } else {
    contatos.innerHTML = `
    <div data-identifier="participant" onclick="selecionarParticipante(this)">
        <img src="icons/persons.svg" alt="pessoas">
        <p>Todos</p>
    </div>
    `;
  }

  for (let i = 0; i < participantes.data.length; i++) {
    if (participantes.data[i].name === contatoSelecionado) {
      contatos.innerHTML += `
            <div data-identifier="participant" class="selecionado" onclick="selecionarParticipante(this)">
                <img src="icons/user.svg" alt="usuário">
                <p>${participantes.data[i].name}</p>
            </div>
        `;
    } else {
      contatos.innerHTML += `
            <div data-identifier="participant" onclick="selecionarParticipante(this)">
                <img src="icons/user.svg" alt="usuário">
                <p>${participantes.data[i].name}</p>
            </div>
        `;
    }
  }
}

let contatoSelecionado = "Todos";

function selecionarParticipante(contato) {
  const participante = document.querySelector(".contatos .selecionado");
  participante.classList.remove("selecionado");

  contato.classList.add("selecionado");

  let nomeDoContatoSelecionado = document.querySelector(
    ".contatos .selecionado p"
  );
  contatoSelecionado = nomeDoContatoSelecionado.innerHTML;
}

function selecionarVisibilidade(elemento) {
  const visibilidade = document.querySelector("aside span.selecionado");
  visibilidade.classList.remove("selecionado");

  elemento.classList.add("selecionado");
}
