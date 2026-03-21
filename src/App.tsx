import { useEffect, useMemo, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoicePreview } from './components/InvoicePreview'
import { ProductTable } from './components/ProductTable'
import { TemplateSelector } from './components/TemplateSelector'
import { createEmptyItem, defaultInvoiceData } from './constants/defaults'
import { InvoicePdfDocument } from './pdf/InvoicePdfDocument'
import type { InvoiceData, InvoiceFormData, InvoiceTemplate, ProductItem } from './types/invoice'
import { calculateSummary } from './utils/invoice'
import stampImage from './assets/logo/vector.png'

const STORAGE_KEY = 'invoice-generator-data-v1'

const withDefaultWhenBlank = (value: string | undefined, fallback: string) =>
  value && value.trim() !== '' ? value : fallback

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultInvoiceData
    try {
      const parsed = JSON.parse(stored) as InvoiceData
      const mergedForm = { ...defaultInvoiceData.form, ...parsed.form }

      const mergedItems = (parsed.items ?? defaultInvoiceData.items).map((item, index) => ({
        ...createEmptyItem(index),
        ...item,
        hsnCode: item.hsnCode ?? '',
      }))

      return {
        ...defaultInvoiceData,
        ...parsed,
        form: {
          ...mergedForm,
          companyName: withDefaultWhenBlank(
            mergedForm.companyName,
            defaultInvoiceData.form.companyName,
          ),
          address: withDefaultWhenBlank(
            mergedForm.address,
            defaultInvoiceData.form.address,
          ),
          phone: withDefaultWhenBlank(
            mergedForm.phone,
            defaultInvoiceData.form.phone,
          ),
          gstNumber: withDefaultWhenBlank(
            mergedForm.gstNumber,
            defaultInvoiceData.form.gstNumber,
          ),
        },
        items: mergedItems,
      }
    } catch {
      return defaultInvoiceData
    }
  })
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const summary = useMemo(() => calculateSummary(invoiceData.items), [invoiceData.items])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData))
  }, [invoiceData])

  const updateForm = (field: keyof InvoiceFormData, value: string) => {
    setInvoiceData((prev) => ({ ...prev, form: { ...prev.form, [field]: value } }))
  }

  const updateProduct = (id: string, field: keyof ProductItem, value: string | number) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addRow = () =>
    setInvoiceData((prev) => ({ ...prev, items: [...prev.items, createEmptyItem(prev.items.length)] }))

  const deleteRow = (id: string) =>
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((item) => item.id !== id),
    }))

  const changeTemplate = (selectedTemplate: InvoiceTemplate) =>
    setInvoiceData((prev) => ({ ...prev, selectedTemplate }))

  const generatePdf = async () => {
    setIsGeneratingPdf(true)
    try {
      const blob = await pdf(<InvoicePdfDocument data={invoiceData} stampSrc={stampImage} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `quotation_${invoiceData.form.quotationNumber || 'draft'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Quotation PDF Generator</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create mobile-responsive quotations, preview in real-time, and export to PDF.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="space-y-4">
            <TemplateSelector value={invoiceData.selectedTemplate} onChange={changeTemplate} />
            <InvoiceForm form={invoiceData.form} onChange={updateForm} />
            <ProductTable
              items={invoiceData.items}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
              onUpdateItem={updateProduct}
            />
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax</span>
                  <span>Rs {summary.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                  <span>Grand Total</span>
                  <span>Rs {summary.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Invoice Preview</h2>
            <InvoicePreview data={invoiceData} stampSrc={stampImage} />
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-xs text-slate-600 sm:text-sm">
            File name: quotation_{invoiceData.form.quotationNumber || 'draft'}.pdf
          </p>
          <button
            type="button"
            onClick={generatePdf}
            disabled={isGeneratingPdf}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isGeneratingPdf ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
