export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback; // Novo callback para o carrossel
  }

  render() {
    return this.itens
      .map(
        (item) => `
          <div class="menu-item">
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image" onclick="(${this.abrirCarrosselCallback})('${JSON.stringify(item.imagens).replace(/'/g, "\\'")}')">`
                : `<div class="menu-item-no-image">Sem Imagem</div>`
            }
            <span>${item.nome} - R$ ${(item.precoUnitario || 0).toFixed(2)}</span>
            <button onclick="(${this.adicionarCallback})('${item.nome}')">
              Adicionar
            </button>
          </div>
        `
      )
      .join("");
  }
}
