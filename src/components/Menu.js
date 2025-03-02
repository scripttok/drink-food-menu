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
            <span class="item-nome">${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <div class="item-actions">
              <button class="adicionar-btn" data-nome="${item.nome}">
                Adicionar
              </button>
              <div class="quantidade-container">
                <input type="number" class="quantidade-input" min="1" value="1">
                <button class="confirmar-btn">OK</button>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }
}
