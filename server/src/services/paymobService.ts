import axios from 'axios'

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || ''
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || ''
const IFRAME_ID = process.env.PAYMOB_IFRAME_ID || ''
const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || ''

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
  return `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`
}

import * as crypto from 'crypto'

export function verifyPaymobHmac(hmac: string, obj: any): boolean {
  if (!HMAC_SECRET) return true // Bypass if no secret configured

  const getStr = (val: any) => {
    if (val === undefined || val === null) return ''
    if (val === true) return 'true'
    if (val === false) return 'false'
    return String(val)
  }

  const dataString =
    getStr(obj.amount_cents) +
    getStr(obj.created_at) +
    getStr(obj.currency) +
    getStr(obj.error_occured) +
    getStr(obj.has_parent_transaction) +
    getStr(obj.id) +
    getStr(obj.integration_id) +
    getStr(obj.is_3d_secure) +
    getStr(obj.is_auth) +
    getStr(obj.is_capture) +
    getStr(obj.is_refunded) +
    getStr(obj.is_standalone_payment) +
    getStr(obj.is_voided) +
    getStr(obj.order?.id) +
    getStr(obj.owner) +
    getStr(obj.pending) +
    getStr(obj.source_data?.pan) +
    getStr(obj.source_data?.sub_type) +
    getStr(obj.source_data?.type) +
    getStr(obj.success)

  const hashed = crypto.createHmac('sha512', HMAC_SECRET).update(dataString).digest('hex')
  return hashed === hmac
}
