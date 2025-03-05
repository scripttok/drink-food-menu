export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback;
    this.quantidades = itens.map(() => 1); // Quantidades iniciais
    this.observacoes = itens.map(() => ""); // Observações iniciais vazias
  }

  render() {
    return this.itens
      .map((item, index) => {
        console.log(`Renderizando ${item.nome}, índice: ${index}, quantidade: ${this.quantidades[index]}, observação: ${this.observacoes[index]}`);
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
            <input type="text" class="observacao-input" id="observacao-${index}" placeholder="Observação (opcional)" value="${this.observacoes[index]}" oninput="updateObservacao(${index}, this.value)">
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

  updateObservacao(index, valor) {
    this.observacoes[index] = valor;
    console.log(`Observação atualizada para "${valor}" no índice ${index}`);
  }

  getQuantidade(index) {
    console.log(`Obtendo quantidade para índice ${index}: ${this.quantidades[index]}`);
    return this.quantidades[index];
  }

  getObservacao(index) {
    console.log(`Obtendo observação para índice ${index}: ${this.observacoes[index]}`);
    return this.observacoes[index];
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

window.updateObservacao = (index, valor) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) {
    menuInstance.updateObservacao(index, valor);
  } else {
    console.error("Instância do Menu não encontrada em updateObservacao!");
  }
};

window.adicionarComQuantidade = (item, index) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) {
    const quantidade = menuInstance.getQuantidade(index);
    const observacao = menuInstance.getObservacao(index);
    console.log(`Chamando adicionar com ${item}, quantidade: ${quantidade}, observação: "${observacao}", índice: ${index}`);
    window.adicionar(item, quantidade, observacao);
  } else {
    console.error("Instância do Menu não encontrada em adicionarComQuantidade!");
  }
};
