// Menu.js
export class Menu {
  constructor(itens, adicionarCallback, abrirCarrosselCallback) {
    this.itens = itens;
    this.adicionarCallback = adicionarCallback;
    this.abrirCarrosselCallback = abrirCarrosselCallback;
    this.quantidades = itens.map(() => 1);
    this.observacoes = itens.map(() => "");
  }

  render() {
    return this.itens
      .map((item, index) => {
        return `
          <div class="menu-item">
            ${
              item.imagens && item.imagens.length > 0
                ? `<img src="${item.imagens[0]}" alt="${item.nome}" class="menu-item-image" onclick="abrirCarrossel(${index})">`
                : `<div class="menu-item-no-image">Sem Imagem</div>`
            }
            <div class="menu-item-details">
              <h3 class="menu-item-name">${item.nome}</h3>
              <p class="menu-item-price">R$ ${(item.precoUnitario || 0).toFixed(2)}</p>
              ${
                item.descrição
                  ? `<p class="menu-item-description">${item.descrição}</p>`
                  : ''
              }
            </div>
            <div class="menu-item-actions">
              <div class="quantity-control">
                <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity-display" id="quantity-${index}">${this.quantidades[index]}</span>
                <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
              </div>
              <input type="text" class="observacao-input" id="observacao-${index}" placeholder="Observação (opcional)" value="${this.observacoes[index]}" oninput="updateObservacao(${index}, this.value)">
              <button class="add-btn" onclick="adicionarComQuantidade('${item.nome}', ${index})">Adicionar</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  updateQuantity(index, change) {
    this.quantidades[index] = Math.max(1, this.quantidades[index] + change);
    document.getElementById(`quantity-${index}`).textContent = this.quantidades[index];
  }

  updateObservacao(index, valor) {
    this.observacoes[index] = valor;
  }

  getQuantidade(index) {
    return this.quantidades[index];
  }

  getObservacao(index) {
    return this.observacoes[index];
  }
}

// Funções globais permanecem iguais
window.updateQuantity = (index, change) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) menuInstance.updateQuantity(index, change);
};

window.updateObservacao = (index, valor) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) menuInstance.updateObservacao(index, valor);
};

window.adicionarComQuantidade = (item, index) => {
  const menuInstance = window.menuInstance;
  if (menuInstance) {
    const quantidade = menuInstance.getQuantidade(index);
    const observacao = menuInstance.getObservacao(index);
    window.adicionar(item, quantidade, observacao);
  }
};
