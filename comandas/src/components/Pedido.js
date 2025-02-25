export class Pedido {
  constructor(mesa) {
    this.mesa = mesa;
    this.itens = [];
  }

  adicionarItem(item) {
    this.itens.push(item);
    alert(`${item} adicionado ao pedido!`);
  }

  getItens() {
    return this.itens;
  }

  limpar() {
    this.itens = [];
  }
}
