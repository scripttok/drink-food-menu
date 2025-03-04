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
        const imagensJson = encodeURIComponent(JSON.stringify(item.imagens || []));
        console.log("String JSON escapada para carrossel:", imagensJson);
        return `
          <div class="menu-item">
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image" onclick="abrirCarrossel(decodeURIComponent('${imagensJson}'))">`
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
