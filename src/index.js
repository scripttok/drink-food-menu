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
  measurementId: "G-7SZT212JXN",
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
const baseUrl = "https://scripttok.github.io/drink-food-menu";

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
        imagens: (item.imagens || []).map((img) =>
          img.startsWith("http://") || img.startsWith("https://") ? img : `${baseUrl}${img}`
        ),
      }));
      console.log("Itens do cardápio carregados (detalhado):", JSON.stringify(itensCardapio, null, 2));
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

window.adicionar = (item, quantidade) => {
  const qtd = parseInt(quantidade, 10); // Garante que seja um número
  console.log(`Adicionando ${qtd} de ${item}`); // Log para depuração
  pedido.adicionarItem(item, "", qtd);
  renderizarCardapio();
};

window.abrirCarrossel = (index) => {
  console.log("Abrindo carrossel para índice:", index);
  const imagens = itensCardapio[index].imagens;
  console.log("Imagens do item (detalhado):", JSON.stringify(imagens, null, 2));
  if (!imagens || imagens.length === 0) {
    console.error("Nenhuma imagem disponível para o item no índice:", index);
    return;
  }
  const carrosselModal = document.createElement("div");
  carrosselModal.className = "carrossel-modal";
  carrosselModal.innerHTML = `
    <div class="carrossel-container">
      <button class="fechar-carrossel" onclick="this.parentElement.parentElement.remove()">X</button>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          ${imagens
            .map(
              (img) => `
            <div class="swiper-slide">
              <img src="${img}" alt="Imagem do produto" onload="console.log('Imagem carregada:', '${img}')" onerror="console.error('Erro ao carregar imagem:', '${img}')">
            </div>
          `
            )
            .join("")}
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    </div>
  `;
  document.body.appendChild(carrosselModal);

  try {
    const swiper = new Swiper(carrosselModal.querySelector(".swiper-container"), {
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    console.log("Swiper inicializado com sucesso para índice:", index);
  } catch (e) {
    console.error("Erro ao inicializar o Swiper:", e);
  }
};

function renderizarCardapio() {
  const menu = new Menu(itensCardapio, "adicionar", "abrirCarrossel");
  window.menuInstance = menu;
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
