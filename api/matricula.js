export const config = {
  runtime: "edge", // força rodar como Edge Function
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // pega os dados que vieram do site
    const dados = await req.json();
    console.log("📩 Dados recebidos no proxy:", dados);

    // URL do seu Apps Script (deploy como Web App)
    const scriptUrl = "https://script.google.com/macros/s/AKfycbynkWWC0P41ye9TWVSGTdZ_RfldqeY1oiwdvYaKdT079SFwxR5luFBc7RpSNk53c41E3w/exec";

    // envia pro Google Apps Script
    const resposta = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    // tenta interpretar resposta como texto (Apps Script geralmente não retorna JSON)
    const texto = await resposta.text();
    console.log("📤 Resposta do Apps Script:", texto);

    return new Response(
      JSON.stringify({ ok: true, resposta: texto }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("❌ Erro no proxy:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno", detalhes: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
