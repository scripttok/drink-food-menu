export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback; // Callback para abrir o carrossel
  }

  render() {
    return this.itens
      .map(
        (item) => `
          <div class="menu-item">
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image" onclick="(${this.abrirCarrosselCallback})('${JSON.stringify(
                    item.imagens
                  )}')">`
                : ""
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
