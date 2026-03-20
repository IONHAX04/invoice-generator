import type { ProductItem } from '../types/invoice'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)

export const getItemSubtotal = (item: ProductItem) =>
  Number(item.price || 0) * Number(item.quantity || 0)

export const getItemTaxAmount = (item: ProductItem) =>
  (getItemSubtotal(item) * Number(item.tax || 0)) / 100

export const getItemTotal = (item: ProductItem) =>
  getItemSubtotal(item) + getItemTaxAmount(item)

export const calculateSummary = (items: ProductItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + getItemSubtotal(item), 0)
  const totalTax = items.reduce((sum, item) => sum + getItemTaxAmount(item), 0)
  const grandTotal = subtotal + totalTax

  return { subtotal, totalTax, grandTotal }
}
