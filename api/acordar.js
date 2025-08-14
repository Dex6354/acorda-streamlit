export default async function handler(req, res) {
  const base = "https://precos-mercados-r4yzmwdzsm4ojqxclxln7k.streamlit.app";

  // 1. Criar sessão
  const getResp = await fetch(base, { method: "GET" });
  const cookies = getResp.headers.get("set-cookie") || "";
  const html = await getResp.text();

  // 2. Pegar token CSRF
  const match = html.match(/"csrfToken":"([^"]+)"/);
  if (!match) {
    res.status(500).send("Token CSRF não encontrado");
    return;
  }
  const token = match[1];

  // 3. Enviar POST wakeup
  await fetch(`${base}/_stcore/wakeup`, {
    method: "POST",
    headers: {
      "Cookie": cookies,
      "X-CSRFToken": token
    }
  });

  // 4. Redirecionar para o app já acordado
  res.redirect(`${base}/?embed=true`);
}
