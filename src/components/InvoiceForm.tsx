import type { InvoiceFormData } from '../types/invoice'

interface InvoiceFormProps {
  form: InvoiceFormData
  onChange: (field: keyof InvoiceFormData, value: string) => void
}

const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export function InvoiceForm({ form, onChange }: InvoiceFormProps) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Input Tab</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Company Name</label>
          <input
            className={inputClassName}
            value={form.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Phone</label>
          <input
            className={inputClassName}
            value={form.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-600">Address</label>
          <textarea
            className={inputClassName}
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            className={inputClassName}
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">GST Number</label>
          <input
            className={inputClassName}
            value={form.gstNumber}
            onChange={(e) => onChange('gstNumber', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Quotation Number</label>
          <input
            className={inputClassName}
            value={form.quotationNumber}
            onChange={(e) => onChange('quotationNumber', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Date</label>
          <input
            type="date"
            className={inputClassName}
            value={form.date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Customer Name</label>
          <input
            className={inputClassName}
            value={form.customerName}
            onChange={(e) => onChange('customerName', e.target.value)}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-600">Customer Address</label>
          <textarea
            className={inputClassName}
            value={form.customerAddress}
            onChange={(e) => onChange('customerAddress', e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-600">Delivery Terms</label>
          <textarea
            className={inputClassName}
            value={form.deliveryTerms}
            onChange={(e) => onChange('deliveryTerms', e.target.value)}
            rows={6}
          />
        </div>
      </div>
    </div>
  )
}
