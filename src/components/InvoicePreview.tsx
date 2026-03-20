import { NOTE_TEXT } from '../constants/defaults'
import type { InvoiceData } from '../types/invoice'
import { calculateSummary, formatCurrency, getItemSubtotal, getItemTaxAmount } from '../utils/invoice'

interface InvoicePreviewProps {
  data: InvoiceData
  stampSrc: string
}

const templateWrapperClass: Record<InvoiceData['selectedTemplate'], string> = {
  classic: 'rounded-xl border border-slate-200 bg-white p-5',
  modern: 'rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-5 shadow-2xl ring-1 ring-indigo-100',
  gst: 'rounded-none border-2 border-slate-900 bg-white p-5',
  compact: 'rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 text-sm',
}

export function InvoicePreview({ data, stampSrc }: InvoicePreviewProps) {
  const summary = calculateSummary(data.items)
  const templateAccent = {
    classic: 'text-slate-900',
    modern: 'text-indigo-900',
    gst: 'text-slate-900',
    compact: 'text-emerald-900',
  }[data.selectedTemplate]
  const tableHeadClass = {
    classic: 'bg-slate-100 text-slate-700',
    modern: 'bg-indigo-100 text-indigo-900',
    gst: 'bg-slate-900 text-white',
    compact: 'bg-emerald-100 text-emerald-900',
  }[data.selectedTemplate]
  const summaryClass = {
    classic: 'bg-slate-50',
    modern: 'bg-indigo-50',
    gst: 'bg-white border border-slate-300',
    compact: 'bg-emerald-100/80',
  }[data.selectedTemplate]
  const noteClass = {
    classic: 'bg-amber-50 text-amber-900',
    modern: 'bg-indigo-50 text-indigo-900',
    gst: 'bg-slate-100 text-slate-900',
    compact: 'bg-emerald-100 text-emerald-900',
  }[data.selectedTemplate]

  return (
    <div className={`${templateWrapperClass[data.selectedTemplate]} space-y-4`}>
      <div className="flex items-start gap-3 border-b border-slate-200 pb-3">
        <img src={stampSrc} alt="Company stamp" className="h-14 w-14 rounded object-contain" />
        <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">From</p>
            <h2 className={`text-lg font-bold ${templateAccent}`}>{data.form.companyName || 'Your Company'}</h2>
            <p className="whitespace-pre-line text-xs text-slate-600">
              {data.form.address || 'Company address'}
            </p>
            <p className="text-xs text-slate-600">
              {data.form.phone || 'Phone'} | {data.form.email || 'Email'}
            </p>
            <p className="text-xs text-slate-600">GST: {data.form.gstNumber || '-'}</p>
          </div>
          <div className="text-xs text-slate-700">
            <p>
              <span className="font-semibold">Quotation No:</span> {data.form.quotationNumber}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {data.form.date}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs text-slate-700">
        <p className="font-semibold">To</p>
        <p>{data.form.customerName || 'Customer name'}</p>
        <p className="whitespace-pre-line">{data.form.customerAddress || 'Customer address'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 text-xs">
          <thead className={tableHeadClass}>
            <tr>
              <th className="border border-slate-200 px-2 py-1 text-left">S.No</th>
              <th className="border border-slate-200 px-2 py-1 text-left">Description</th>
              <th className="border border-slate-200 px-2 py-1 text-right">Price</th>
              <th className="border border-slate-200 px-2 py-1 text-right">Qty</th>
              <th className="border border-slate-200 px-2 py-1 text-right">Tax %</th>
              <th className="border border-slate-200 px-2 py-1 text-right">Subtotal</th>
              <th className="border border-slate-200 px-2 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-slate-200 px-2 py-1">{index + 1}</td>
                <td className="border border-slate-200 px-2 py-1">{item.description || '-'}</td>
                <td className="border border-slate-200 px-2 py-1 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="border border-slate-200 px-2 py-1 text-right">{item.quantity}</td>
                <td className="border border-slate-200 px-2 py-1 text-right">{item.tax}</td>
                <td className="border border-slate-200 px-2 py-1 text-right">
                  {formatCurrency(getItemSubtotal(item))}
                </td>
                <td className="border border-slate-200 px-2 py-1 text-right">
                  {formatCurrency(getItemSubtotal(item) + getItemTaxAmount(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`ml-auto w-full max-w-xs space-y-1 rounded-lg p-3 text-xs text-slate-700 ${summaryClass}`}>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Tax</span>
          <span>{formatCurrency(summary.totalTax)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900">
          <span>Grand Total</span>
          <span>{formatCurrency(summary.grandTotal)}</span>
        </div>
      </div>

      <div className="space-y-1 text-xs text-slate-700">
        <p className="font-semibold">Delivery Terms</p>
        <p className="whitespace-pre-line">{data.form.deliveryTerms}</p>
      </div>

      <div className={`rounded-lg p-3 text-xs ${noteClass}`}>
        <span className="font-semibold">Note:</span> {NOTE_TEXT}
      </div>
    </div>
  )
}
