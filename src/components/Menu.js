export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback;
    this.quantidades = itens.map(() => 1); // Quantidades iniciais
  }

  render() {
    return this.itens
      .map((item, index) => {
        console.log(`Renderizando ${item.nome}, índice: ${index}, quantidade inicial: ${this.quantidades[index]}`);
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
            <button class="add-btn" onclick="adicionarComQuantidade('${item.nome}', ${index})">
              Adicionar
            </button>
          </div>
        `;
      })
      .join("");
  }

  updateQuantity(index, change) {
    this.quantidades[index] = Math.max(1, this.quantidades[index] + change);
    console.log(`Quantidade atualizada para ${this.quantidades[index]} no índice ${index}`);
    document.getElementById(`quantity-${index}`).textContent = this.quantidades[index];
  }

  getQuantidade(index) {
    console.log(`Obtendo quantidade para índice ${index}: ${this.quantidades[index]}`);
    return this.quantidades[index];
  }
}

window.updateQuantity = (index, change) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) {
    menuInstance.updateQuantity(index, change);
  } else {
    console.error("Instância do Menu não encontrada em updateQuantity!");
  }
};

window.adicionarComQuantidade = (item, index) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) {
    const quantidade = menuInstance.getQuantidade(index);
    console.log(`Chamando adicionar com ${item}, quantidade: ${quantidade}, índice: ${index}`);
    window.adicionar(item, quantidade);
  } else {
    console.error("Instância do Menu não encontrada em adicionarComQuantidade!");
  }
};
