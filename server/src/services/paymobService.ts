import axios from 'axios'

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || ''
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || ''
const IFRAME_ID = process.env.PAYMOB_IFRAME_ID || ''

export async function getAuthToken(): Promise<string> {
  const { data } = await axios.post('https://accept.paymob.com/api/auth/tokens', {
    api_key: PAYMOB_API_KEY,
  })
  return data.token
}

export async function createOrder(authToken: string, amountCents: number): Promise<number> {
  const { data } = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: 'EGP',
    items: [],
  })
  return data.id
}

export async function getPaymentKey(
  authToken: string,
  orderId: number,
  amountCents: number,
  billingData: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    city: string
    country: string
    street: string
    floor: string
    apartment: string
    building: string
    postal_code: string
    shipping_method: string
    state: string
  }
): Promise<string> {
  const { data } = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: billingData,
    currency: 'EGP',
    integration_id: Number(INTEGRATION_ID),
  })
  return data.token
}

export function getIframeUrl(paymentKey: string): string {
  return `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey}`
}
