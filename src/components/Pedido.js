export class Pedido {
  constructor(mesa) {
    this.mesa = mesa;
    this.itens = [];
  }

  adicionarItem(nome, quantidade) {
    const existingItem = this.itens.find((i) => i.nome === nome);
    if (existingItem) {
      existingItem.quantidade += quantidade;
    } else {
      this.itens.push({ nome, quantidade });
    }
    this.renderizarPedidos(); // Atualiza a UI
    alert(`${nome} x${quantidade} adicionado ao pedido!`);
  }

  getItens() {
    return this.itens;
  }

  limpar() {
    this.itens = [];
    this.renderizarPedidos(); // Limpa a UI
  }

  renderizarPedidos() {
    const pedidosList = document.getElementById("pedidos-list");
    if (!pedidosList) return;
    pedidosList.innerHTML = this.itens
      .map((item) => `<li>${item.nome} x${item.quantidade}</li>`)
      .join("");
  }
}
