export class Pedido {
  constructor(mesa) {
    this.mesa = mesa;
    this.itens = [];
  }

  adicionarItem(item, observacao = "", quantidade = 1) {
    const existingItem = this.itens.find((i) => i.nome === item);
    if (existingItem) {
      existingItem.quantidade += quantidade;
      existingItem.observacao = observacao || existingItem.observacao;
    } else {
      this.itens.push({ nome: item, quantidade, observacao });
    }
    alert(`${item} x${quantidade} adicionado ao pedido${observacao ? ` com observação: ${observacao}` : ""}!`);
  }

  removerItem(nome) {
    this.itens = this.itens.filter((item) => item.nome !== nome);
    console.log(`Item ${nome} removido do pedido. Itens restantes:`, JSON.stringify(this.itens, null, 2));
  }

  getItens() {
    return this.itens;
  }

  limpar() {
    this.itens = [];
  }
}
