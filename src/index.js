import { MesaInfo } from "./components/MesaInfo.js";
import { Menu } from "./components/Menu.js";
import { Pedido } from "./components/Pedido.js";
import { enviarPedido } from "./services/api.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAto25h5ZeIJ6GPlIsyuXAdc4igrgMgzhk",
  authDomain: "bar-do-cesar.firebaseapp.com",
  databaseURL: "https://bar-do-cesar-default-rtdb.firebaseio.com",
  projectId: "bar-do-cesar",
  storageBucket: "bar-do-cesar.firebasestorage.app",
  messagingSenderId: "525946263891",
  appId: "1:525946263891:web:6179063c88e3f45d2c29a6",
  measurementId: "G-7SZT212JXN",
};

const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);

const app = document.getElementById("app");
const urlParams = new URLSearchParams(window.location.search);
const mesa = urlParams.get("mesa") || "N/A";

// Instancia o pedido
const pedido = new Pedido(mesa);

// Callback para adicionar itens
window.adicionar = (item) => pedido.adicionarItem(item);

// Buscar o cardápio dinamicamente do Firebase
let itensCardapio = [];
const cardapioRef = ref(db, "cardapio");
onValue(cardapioRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    itensCardapio = Object.values(data).map((item) => ({
      nome: item.nome,
      preco: item.precoUnitario,
    }));
  } else {
    itensCardapio = [];
  }
  renderizarCardapio(); // Renderiza após atualizar os itens
}, (error) => {
  console.error("Erro ao buscar cardápio:", error);
  app.innerHTML = "<p>Erro ao carregar o cardápio</p>";
});

// Função para renderizar o cardápio
function renderizarCardapio() {
  const menu = new Menu(itensCardapio, "adicionar");
  app.innerHTML = `
    ${MesaInfo()}
    <div>${menu.render()}</div>
    <button id="enviar-pedido" onclick="enviar()">Enviar Pedido</button>
  `;
}

// Função para enviar o pedido
window.enviar = async () => {
  if (pedido.getItens().length > 0) {
    await enviarPedido(pedido.mesa, pedido.getItens());
    pedido.limpar();
    renderizarCardapio(); // Re-renderiza após limpar o pedido
  } else {
    alert("Adicione itens ao pedido antes de enviar!");
  }
};

// Renderização inicial
renderizarCardapio();
