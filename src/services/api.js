import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, update, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

async function getFichasTecnicas() {
  const snapshot = await get(ref(db, "fichasTecnicas"));
  const data = snapshot.val() || {};
  console.log("Fichas técnicas carregadas na web:", data);
  return data;
}

export async function criarOuVerificarMesa(numeroMesa) {
  try {
    const mesasRef = ref(db, "mesas");
    const snapshot = await get(mesasRef);
    const mesas = snapshot.val() || {};
    
    // Verifica se já existe uma mesa com esse número
    const mesaExistente = Object.values(mesas).find(m => m.numero === numeroMesa);
    if (mesaExistente) {
      console.log(`Mesa ${numeroMesa} já existe no Firebase.`);
      return;
    }

    // Cria a mesa se não existir
    const novaMesa = {
      numero: numeroMesa,
      nomeCliente: `Cliente Mesa ${numeroMesa}`, // Nome genérico
      pedidos: [],
      posX: 0,
      posY: 0,
      status: "aberta",
      createdAt: { ".sv": "timestamp" },
    };
    await push(mesasRef, novaMesa);
    console.log(`Mesa ${numeroMesa} criada com sucesso no Firebase.`);
  } catch (error) {
    console.error("Erro ao criar/verificar mesa:", error);
    throw error;
  }
}

async function removerEstoque(itemId, quantidade) {
  const refEstoque = ref(db, `estoque/${itemId}`);
  const snapshot = await get(refEstoque);
  const item = snapshot.val();
  if (!item) throw new Error(`Item "${itemId}" não encontrado no estoque.`);
  const novaQuantidade = Math.max(0, (item.quantidade || 0) - quantidade);
  await update(refEstoque, { quantidade: novaQuantidade });
  console.log(`Removido do estoque: ${itemId}, quantidade: ${quantidade}, novo total: ${novaQuantidade}`);
}

export async function enviarPedido(mesa, itens) {
  try {
    const fichasTecnicas = await getFichasTecnicas();
    const estoqueSnapshot = await get(ref(db, "estoque"));
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
      console.log(`Verificando ficha técnica para ${nome}:`, ficha);
      if (ficha) {
        Object.entries(ficha).forEach(([estoqueId, quantidadePorUnidade]) => {
          const quantidadeNecessaria = quantidadePorUnidade * quantidade;
          const estoqueDisponivel = estoquePorId[estoqueId] || 0;
          console.log(`Estoque disponível para ${estoqueId}: ${estoqueDisponivel}, necessário: ${quantidadeNecessaria}`);
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
      } else {
        console.warn(`Ficha técnica não encontrada para ${nome}`);
      }
    });

    if (itensFaltando.length > 0) {
      throw new Error(`Estoque insuficiente para: ${itensFaltando.join(", ")}`);
    }

    await Promise.all(
      atualizacoesEstoque.map(({ id, quantidade }) =>
        removerEstoque(id, quantidade)
      )
    );

    const pedido = {
      mesa,
      itens,
      status: "aguardando",
      entregue: false,
      timestamp: { ".sv": "timestamp" },
    };
    await push(ref(db, "pedidos"), pedido);
    alert("Pedido enviado para a cozinha!");
    console.log("Pedido enviado:", pedido);
  } catch (error) {
    alert("Erro ao enviar o pedido: " + error.message);
    console.error("Erro ao enviar pedido:", error);
  }
}
