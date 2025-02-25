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
                        <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
                        <button onclick="(${this.adicionarCallback})('${
          item.nome
        }')">
                            Adicionar
                        </button>
                    </div>
                `
      )
      .join("");
  }
}
