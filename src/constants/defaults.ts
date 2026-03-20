import type { InvoiceData, ProductItem } from '../types/invoice'

const today = new Date()

const buildQuotationNumber = () => {
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `QTN-${year}${month}${day}-001`
}

export const DEFAULT_DELIVERY_TERMS = [
  '1. First two deliveries free to factory, after that customer handles delivery',
  '2. Delivery within 10-15 days from order confirmation',
  '3. Full advance payment required',
  '4. 1000 MTR dispatch only from Salem office',
  '5. Freight charges handled by customer',
].join('\n')

export const NOTE_TEXT =
  'Yarn prices are increasing day by day. Billing will be based on the price at the time of billing.'

export const createEmptyItem = (idSeed?: number): ProductItem => ({
  id: `${Date.now()}-${idSeed ?? Math.random()}`,
  description: '',
  price: 0,
  quantity: 1,
  tax: 0,
})

export const defaultInvoiceData: InvoiceData = {
  form: {
    companyName: 'Sri Lakshmi Narashima Braiders',
    address:
      '16, Karukkampalaiyathar Street, Velanatham,\nAttaiyampatty, Salem - 637501.',
    phone: '7418337321',
    email: '',
    gstNumber: '33EUZPD01201Z2',
    quotationNumber: buildQuotationNumber(),
    date: today.toISOString().slice(0, 10),
    customerName: '',
    customerAddress: '',
    deliveryTerms: DEFAULT_DELIVERY_TERMS,
  },
  items: [createEmptyItem(1)],
  selectedTemplate: 'classic',
}
