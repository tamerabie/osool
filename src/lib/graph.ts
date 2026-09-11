const GRAPH_SCOPE = "https://graph.microsoft.com/.default";

export async function getGraphToken(): Promise<string> {
  const tenant = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const secret = process.env.AZURE_CLIENT_SECRET;
  if (!tenant || !clientId || !secret) {
    throw new Error("Azure Graph env vars are not set");
  }
  const res = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        scope: GRAPH_SCOPE,
        grant_type: "client_credentials",
        client_secret: secret,
      }),
    }
  );
  if (!res.ok) throw new Error(`Graph token error: ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

export async function sendMail(to: string, subject: string, content: string) {
  const token = await getGraphToken();
  const sender = process.env.AZURE_SENDER_EMAIL;
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${sender}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "Text", content },
          toRecipients: [{ emailAddress: { address: to } }],
        },
        saveToSentItems: true,
      }),
    }
  );
  if (!res.ok) throw new Error(`sendMail error: ${await res.text()}`);
  return { ok: true };
}
