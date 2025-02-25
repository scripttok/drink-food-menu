export async function enviarPedido(mesa, itens) {
  const response = await fetch("https://seuservidor.com/pedido", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesa, itens }),
  });

  if (response.ok) {
    alert("Pedido enviado para a cozinha!");
  } else {
    alert("Erro ao enviar o pedido.");
  }
}
