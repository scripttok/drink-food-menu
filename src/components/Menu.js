export class Menu {
  constructor(itens, adicionarCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
  }

  render() {
    return this.itens
      .map(
        (item) => `
          <div class="menu-item">
            <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <button class="adicionar-btn" data-nome="${item.nome}">
              Adicionar
            </button>
            <div class="quantidade-container" style="display: none;">
              <input type="number" class="quantidade-input" min="1" value="1" style="width: 50px;">
              <button class="confirmar-btn">OK</button>
            </div>
          </div>
        `
      )
      .join("");
  }
}
