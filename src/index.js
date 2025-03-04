import { MesaInfo } from "./components/MesaInfo.js";
import { Menu } from "./components/Menu.js";
import { Pedido } from "./components/Pedido.js";
import { enviarPedido } from "./services/api.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAto25h5ZeIJ6GPlIsyuXAdc4igrgMgzhk",
  authDomain: "bar-do-cesar.firebaseapp.com",
  databaseURL: "https://bar-do-cesar-default-rtdb.firebaseio.com",
  projectId: "bar-do-cesar",
  storageBucket: "bar-do-cesar.firebasestorage.app",
  messagingSenderId: "525946263891",
  appId: "1:525946263891:web:6179063c88e3f45d2c29a6",
  measurementId: "G-7SZT212JXN"
};

let appFirebase;
if (!getApps().length) {
  appFirebase = initializeApp(firebaseConfig);
} else {
  appFirebase = getApps()[0];
}
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
  pedido.adicionarItem(item);
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
        ${pedido.getItens().map((item) => `<li>${item.nome} x${item.quantidade}</li>`).join("")}
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
