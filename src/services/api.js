import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import firebase from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"; // API compatível

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

export async function enviarPedido(mesa, itens) {
  try {
    const pedido = {
      mesa: mesa,
      itens: itens, // Já está no formato correto [{ nome, quantidade }]
      status: "aguardando",
      entregue: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP, // Usando a API compatível
    };
    await push(ref(db, "pedidos"), pedido);
    alert("Pedido enviado para a cozinha!");
    console.log("Pedido enviado:", pedido);
  } catch (error) {
    alert("Erro ao enviar o pedido: " + error.message);
    console.error("Erro ao enviar pedido:", error);
  }
}
