import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, update, once } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import firebase from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyAto25h5ZeIJ6GPlIsyuXAdc4igrgMgzhk",
  authDomain: "bar-do-cesar.firebaseapp.com",
  databaseURL: "https://bar-do-cesar-default-rtdb.firebaseio.com",
  projectId: "bar-do-cesar",
  storageBucket: "bar-do-cesar.firebasestorage.app",
  messagingSenderId: "525946263891",
  appId: "1:525946263891:web:6179063c88e3f45d2c29a6",
  measurementId: "G-7SZT212JXN",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Fichas técnicas dos itens do cardápio (alinhado com o app)
const fichasTecnicas = {
  Agua_Garrafa_220ml: { Agua_Garrafa_220ml: 1 },
  Agua_bonafonte_2lt: { Agua_bonafonte_2lt: 1 },
  Cervejas_Brahma_Garrafa_600ml: { Cervejas_Brahma_Garrafa_600ml: 1 },
  Cervejas_Brahma_Lata_220ml: { Cervejas_Brahma_Lata_220ml: 1 },
  Cervejas_Heineken_Garrafa_600ml: { Cervejas_Heineken_Garrafa_600ml: 1 },
  Cervejas_Heineken_Lata_250ml: { Cervejas_Heineken_Lata_250ml: 1 },
  Salgados_Coxinha: { Diverso: 1 },
  Vinhos_Brancos: { Vinhos_Brancos: 1 },
  "Pizza Margherita": { Agua: 0.1 },
  Hambúrguer: { cerveja: 0.2 },
  Refrigerante: { Refrigerante: 1 },
  "Suco de laranja": { "Suco de laranja": 1 }, // Adicionado para exemplo
};

// Função para remover do estoque (similar ao app)
async function removerEstoque(itemId, quantidade) {
  const refEstoque = ref(db, `estoque/${itemId}`);
  const snapshot = await once(refEstoque);
  const item = snapshot.val();
  if (!item) throw new Error(`Item "${itemId}" não encontrado no estoque.`);
  const novaQuantidade = Math.max(0, (item.quantidade || 0) - quantidade);
  await update(refEstoque, { quantidade: novaQuantidade });
  console.log(`Removido do estoque: ${itemId}, quantidade: ${quantidade}, novo total: ${novaQuantidade}`);
}

export async function enviarPedido(mesa, itens) {
  try {
    // Verificar e atualizar o estoque
    const estoqueSnapshot = await once(ref(db, "estoque"));
    const estoqueAtual = estoqueSnapshot.val() || {};
    const estoquePorId = Object.entries(estoqueAtual).reduce(
      (acc, [id, value]) => {
        acc[id] = value.quantidade || 0;
        return acc;
      },
      {}
    );

    const itensFaltando = [];
    const atualizacoesEstoque = [];

    itens.forEach(({ nome, quantidade }) => {
      const ficha = fichasTecnicas[nome];
      if (ficha) {
        Object.entries(ficha).forEach(([estoqueId, quantidadePorUnidade]) => {
          const quantidadeNecessaria = quantidadePorUnidade * quantidade;
          const estoqueDisponivel = estoquePorId[estoqueId] || 0;
          if (estoqueDisponivel < quantidadeNecessaria) {
            itensFaltando.push(
              `${nome} (falta ${quantidadeNecessaria - estoqueDisponivel} de ${estoqueId})`
            );
          } else {
            atualizacoesEstoque.push({
              id: estoqueId,
              quantidade: quantidadeNecessaria,
            });
          }
        });
      }
    });

    if (itensFaltando.length > 0) {
      throw new Error(`Estoque insuficiente para: ${itensFaltando.join(", ")}`);
    }

    // Atualizar o estoque
    await Promise.all(
      atualizacoesEstoque.map(({ id, quantidade }) =>
        removerEstoque(id, quantidade)
      )
    );

    // Salvar o pedido
    const pedido = {
      mesa: mesa,
      itens: itens,
      status: "aguardando",
      entregue: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    await push(ref(db, "pedidos"), pedido);
    alert("Pedido enviado para a cozinha!");
    console.log("Pedido enviado:", pedido);
  } catch (error) {
    alert("Erro ao enviar o pedido: " + error.message);
    console.error("Erro ao enviar pedido:", error);
  }
}
