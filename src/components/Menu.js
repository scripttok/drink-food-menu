export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback;
  }

  render() {
    return this.itens
      .map((item) => {
        console.log("Item sendo renderizado:", item);
        const imagensJson = JSON.stringify(item.imagens || []).replace(/'/g, "\\'");
        console.log("String JSON para carrossel:", imagensJson);
        return `
          <div class="menu-item">
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image" onclick="(${this.abrirCarrosselCallback})('${imagensJson}')">`
                : `<div class="menu-item-no-image">Sem Imagem</div>`
            }
            <span>${item.nome} - R$ ${(item.precoUnitario || 0).toFixed(2)}</span>
            <button onclick="(${this.adicionarCallback})('${item.nome}')">
              Adicionar
            </button>
          </div>
        `;
      })
      .join("");
  }
}
