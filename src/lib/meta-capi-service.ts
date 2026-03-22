/**
 * SERVIÇO DE CONVERSÕES API (META CAPI)
 */
export async function trackCapiEvent(
  pixelId: string, 
  accessToken: string, 
  eventName: string, 
  userData: { em?: string; ph?: string; client_ip_address?: string; client_user_agent?: string },
  customData?: any
) {
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;
  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: {
        em: userData.em ? [userData.em] : undefined,
        ph: userData.ph ? [userData.ph] : undefined,
        client_ip_address: userData.client_ip_address,
        client_user_agent: userData.client_user_agent,
      },
      custom_data: customData,
    }],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (err) {
    console.error("[CAPI Error]:", err);
    return null;
  }
}
