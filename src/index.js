import { MesaInfo } from "./components/MesaInfo.js";
import { Menu } from "./components/Menu.js";
import { Pedido } from "./components/Pedido.js";
import { enviarPedido } from "./services/api.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "SuaApiKey",
  authDomain: "SeuAuthDomain",
  databaseURL: "SeuDatabaseURL",
  projectId: "SeuProjectId",
  storageBucket: "SeuStorageBucket",
  messagingSenderId: "SeuMessagingSenderId",
  appId: "SeuAppId",
  measurementId: "SeuMeasurementId",
};

const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);

const app = document.getElementById("app");
const urlParams = new URLSearchParams(window.location.search);
const mesa = urlParams.get("mesa") || "N/A";

const pedido = new Pedido(mesa);

let itensCardapio = [];
const cardapioRef = ref(db, "cardapio");
onValue(
  cardapioRef,
  (snapshot) => {
    const data = snapshot.val();
    if (data) {
      itensCardapio = Object.values(data).map((item) => ({
        nome: item.nome,
        precoUnitario: item.precoUnitario,
        imagens: item.imagens || [],
      }));
    } else {
      itensCardapio = [];
    }
    renderizarCardapio();
  },
  (error) => {
    console.error("Erro ao buscar cardápio:", error);
    app.innerHTML = "<p>Erro ao carregar o cardápio</p>";
  }
);

window.adicionar = (item) => {
  const observacao = prompt(`Adicionar observação para ${item}? (ex.: "sem açúcar")`);
  pedido.adicionarItem(item, observacao);
  renderizarCardapio();
};

window.abrirCarrossel = (imagensJson) => {
  const imagens = JSON.parse(imagensJson);
  const carrosselModal = document.createElement("div");
  carrosselModal.className = "carrossel-modal";
  carrosselModal.innerHTML = `
    <div class="carrossel-container">
      <button class="fechar-carrossel" onclick="this.parentElement.parentElement.remove()">X</button>
      <div class="carousel">
        ${imagens
          .map(
            (img) => `
          <div>
            <img src="${img}" alt="Imagem do produto" style="width: 100%; height: auto;">
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
  document.body.appendChild(carrosselModal);

  // Inicializar o carrossel
  const carousel = new window.Carousel(carrosselModal.querySelector(".carousel"), {
    infinite: false,
    navigationNextLabel: ">",
    navigationPrevLabel: "<",
  });
};

function renderizarCardapio() {
  const menu = new Menu(itensCardapio, "adicionar", "abrirCarrossel");
  app.innerHTML = `
    ${MesaInfo()}
    <div>${menu.render()}</div>
    <div id="pedidos-list">
      <h2>Itens Selecionados:</h2>
      <ul>
        ${pedido
          .getItens()
          .map(
            (item) => `
          <li>${item.nome} x${item.quantidade}${
              item.observacao ? ` (${item.observacao})` : ""
            }</li>
        `
          )
          .join("")}
      </ul>
    </div>
    <button id="enviar-pedido" onclick="enviar()">Enviar Pedido</button>
  `;
}

window.enviar = async () => {
  if (pedido.getItens().length > 0) {
    await enviarPedido(pedido.mesa, pedido.getItens());
    pedido.limpar();
    renderizarCardapio();
  } else {
    alert("Adicione itens ao pedido antes de enviar!");
  }
};

renderizarCardapio();
