export type InvoiceTemplate = 'classic' | 'modern' | 'gst' | 'compact'

export interface ProductItem {
  id: string
  description: string
  price: number
  quantity: number
  tax: number
}

export interface InvoiceFormData {
  companyName: string
  address: string
  phone: string
  email: string
  gstNumber: string
  quotationNumber: string
  date: string
  customerName: string
  customerAddress: string
  deliveryTerms: string
}

export interface InvoiceData {
  form: InvoiceFormData
  items: ProductItem[]
  selectedTemplate: InvoiceTemplate
}
