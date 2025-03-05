export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback;
    this.quantidades = itens.map(() => 1); // Array para armazenar quantidades (inicia em 1)
  }

  render() {
    return this.itens
      .map((item, index) => {
        console.log("Item sendo renderizado:", item);
        return `
          <div class="menu-item">
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image" onclick="abrirCarrossel(${index})">`
                : `<div class="menu-item-no-image">Sem Imagem</div>`
            }
            <span>${item.nome} - R$ ${(item.precoUnitario || 0).toFixed(2)}</span>
            <div class="quantity-control">
              <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
              <span class="quantity-display" id="quantity-${index}">${this.quantidades[index]}</span>
              <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="add-btn" onclick="${this.adicionarCallback}('${item.nome}', document.getElementById('quantity-${index}').textContent)">
              Adicionar
            </button>
          </div>
        `;
      })
      .join("");
  }

  // Função para atualizar a quantidade
  updateQuantity(index, change) {
    this.quantidades[index] = Math.max(1, this.quantidades[index] + change); // Mínimo de 1
    document.getElementById(`quantity-${index}`).textContent = this.quantidades[index];
  }
}

// Função global para atualizar a quantidade (chamada pelos botões +/-)
window.updateQuantity = (index, change) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) {
    menuInstance.updateQuantity(index, change);
  }
};
