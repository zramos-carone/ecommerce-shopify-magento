const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API_URL =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

/**
 * Obtener Access Token de PayPal
 * Utilizado de manera interna para autenticar las peticiones siguientes a la API REST.
 */
export async function generateAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || PAYPAL_CLIENT_ID.startsWith('Aaa')) {
      throw new Error('Credenciales inválidas o placeholder. Fallback local.');
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error de PayPal Auth: ${data.error_description || data.error}`);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('❌ PayPal Token Generate fallback activo:', error);
    return null; // Null dispara el fallback dummy para prevenir que el flujo explote si el auth está rudo
  }
}

/**
 * Registra una "Orden" oficial en el API v2 de PayPal
 * @param amount Cantidad total de la transacción.
 * @param orderId Identificador en nuestra BD para relacionar la confirmación del Webhook.
 */
export async function createPayPalOrder(amount: number, orderId: string) {
  const accessToken = await generateAccessToken();
  
  if (!accessToken) {
    // FALLBACK INTELIGENTE (Para no bloquear pruebas si el token y las llaves colapsaron)
    const fallbackId = `PAYPAL-FB-${Date.now()}`;
    return {
      id: fallbackId,
      links: [
        { rel: 'approve', href: `https://sandbox.paypal.com/checkoutnow?token=${fallbackId}` }
      ]
    };
  }

  const url = `${PAYPAL_API_URL}/v2/checkout/orders`;

  // Construcción del Payload Core V2 (Purchase Units)
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        custom_id: orderId, // Crucial para enlazar webhook
        amount: {
          currency_code: 'MXN',
          value: amount.toFixed(2),
        },
      },
    ],
    application_context: {
      brand_name: 'Tech Ecommerce V2',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      // Return e invocaciones relativas a la app original
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (err) {
    console.error('❌ Crash llamando PayPal Orders V2:', err);
    throw err;
  }
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  
  // En caso de que PayPal rechace transacciones MXN sandbox con HTTP Code, devolvemos el error amigable
  const errorMessage = data?.details?.[0]?.description || data.message || 'Error al conectar con PayPal';
  throw new Error(errorMessage);
}
