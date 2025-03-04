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
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image">`
                : `<div class="menu-item-no-image">Sem Imagem</div>`
            }
            <span>${item.nome} - R$ ${item.precoUnitario.toFixed(2)}</span>
            <button onclick="(${this.adicionarCallback})('${item.nome}')">
              Adicionar
            </button>
          </div>
        `
      )
      .join("");
  }
}
