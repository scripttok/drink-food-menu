export class Pedido {
  constructor(mesa) {
    this.mesa = mesa;
    this.itens = [];
  }

  adicionarItem(item, observacao = "") {
    const existingItem = this.itens.find((i) => i.nome === item);
    if (existingItem) {
      existingItem.quantidade += 1;
      existingItem.observacao = observacao || existingItem.observacao; // Mantém a observação existente se não houver nova
    } else {
      this.itens.push({ nome: item, quantidade: 1, observacao });
    }
    alert(`${item} adicionado ao pedido${observacao ? ` com observação: ${observacao}` : ""}!`);
  }

  getItens() {
    return this.itens;
  }

  limpar() {
    this.itens = [];
  }
}
