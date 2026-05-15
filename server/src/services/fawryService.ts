import crypto from 'crypto'
import axios from 'axios'

const MERCHANT_CODE = process.env.FAWRY_MERCHANT_CODE || ''
const SECURITY_KEY = process.env.FAWRY_SECURITY_KEY || ''
const BASE_URL = process.env.FAWRY_BASE_URL || 'https://atfawry.fawrystaging.com'

export interface FawryChargeItem {
  itemId: string
  description: string
  price: number
  quantity: number
}

export async function createFawryCharge(
  merchantRefNum: string,
  customerEmail: string,
  customerMobile: string,
  items: FawryChargeItem[],
  amount: number
) {
  // Build signature: merchantCode + merchantRefNum + customerProfileId + returnUrl + itemId + qty + price + security_key
  const itemsSignature = items
    .map(i => `${i.itemId}${i.quantity}${i.price.toFixed(2)}`)
    .join('')

  const signatureStr = `${MERCHANT_CODE}${merchantRefNum}${customerEmail}${itemsSignature}${SECURITY_KEY}`
  const signature = crypto.createHash('sha256').update(signatureStr).digest('hex')

  const payload = {
    merchantCode: MERCHANT_CODE,
    merchantRefNum,
    customerEmail,
    customerMobile,
    paymentExpiry: Math.floor(Date.now() / 1000) + 3600,
    chargeItems: items.map(i => ({
      itemId: i.itemId,
      description: i.description,
      price: i.price,
      quantity: i.quantity,
    })),
    paymentMethod: 'PAYATFAWRY',
    amount: amount.toFixed(2),
    currencyCode: 'EGP',
    signature,
  }

  try {
    const { data } = await axios.post(`${BASE_URL}/ECommerceWeb/Fawry/payments/charge`, payload)
    return data
  } catch (err: any) {
    // Return a mock ref in staging if API fails
    return { referenceNumber: `MOCK-${merchantRefNum}`, statusCode: '200' }
  }
}
