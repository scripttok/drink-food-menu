export function MesaInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const mesa = urlParams.get("mesa") || "N/A";

  return `<h1>Cardápio - Mesa ${mesa}</h1>`;
}
