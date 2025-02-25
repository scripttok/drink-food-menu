import { MesaInfo } from "./components/MesaInfo.js";
import { Menu } from "./components/Menu.js";
import { Pedido } from "./components/Pedido.js";
import { enviarPedido } from "./services/api.js";

const app = document.getElementById("app");
const urlParams = new URLSearchParams(window.location.search);
const mesa = urlParams.get("mesa") || "N/A";

// Dados do cardápio (poderia vir de uma API)
const itensCardapio = [
  { nome: "Pizza Margherita", preco: 40.0 },
  { nome: "Hambúrguer", preco: 25.0 },
  { nome: "Refrigerante", preco: 8.0 },
];

// Instancia o pedido
const pedido = new Pedido(mesa);

// Callback para adicionar itens
window.adicionar = (item) => pedido.adicionarItem(item);

// Renderiza o cardápio
const menu = new Menu(itensCardapio, "adicionar");
app.innerHTML = `
    ${MesaInfo()}
    <div>${menu.render()}</div>
    <button id="enviar-pedido" onclick="enviar()">Enviar Pedido</button>
`;

// Função para enviar o pedido
window.enviar = async () => {
  if (pedido.getItens().length > 0) {
    await enviarPedido(pedido.mesa, pedido.getItens());
    pedido.limpar();
  } else {
    alert("Adicione itens ao pedido antes de enviar!");
  }
};
