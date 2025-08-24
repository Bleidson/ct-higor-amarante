// /api/matricula.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const scriptURL = "https://script.google.com/macros/s/AKfycbynkWWC0P41ye9TWVSGTdZ_RfldqeY1oiwdvYaKdT079SFwxR5luFBc7RpSNk53c41E3w/exec";

    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    });

    const text = await response.text(); // NÃO usar .json()
    res.status(200).send(text); // envia o texto diretamente
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar matrícula para o Google Script");
  }
}
