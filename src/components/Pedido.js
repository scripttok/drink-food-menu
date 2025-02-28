export class Pedido {
  constructor(mesa) {
    this.mesa = mesa;
    this.itens = [];
  }

  adicionarItem(item) {
    // Verifica se o item já existe para acumular a quantidade
    const existingItem = this.itens.find(i => i.nome === item);
    if (existingItem) {
      existingItem.quantidade += 1;
    } else {
      this.itens.push({ nome: item, quantidade: 1 });
    }
    alert(`${item} adicionado ao pedido!`);
  }

  getItens() {
    return this.itens;
  }

  limpar() {
    this.itens = [];
  }
}
