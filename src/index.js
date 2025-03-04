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
  pedido.adicionarItem(item);
  renderizarCardapio();
};

function renderizarCardapio() {
  const menu = new Menu(itensCardapio, "adicionar");
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
