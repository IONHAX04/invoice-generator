import type { InvoiceTemplate } from '../types/invoice'

const templates: { label: string; value: InvoiceTemplate }[] = [
  { label: 'Template 1 - Classic minimal', value: 'classic' },
  { label: 'Template 2 - Modern card style', value: 'modern' },
  { label: 'Template 3 - GST-style professional', value: 'gst' },
  { label: 'Template 4 - Compact mobile-friendly', value: 'compact' },
]

interface TemplateSelectorProps {
  value: InvoiceTemplate
  onChange: (value: InvoiceTemplate) => void
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="template" className="text-sm font-medium text-slate-700">
        Invoice Template
      </label>
      <select
        id="template"
        value={value}
        onChange={(event) => onChange(event.target.value as InvoiceTemplate)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {templates.map((template) => (
          <option key={template.value} value={template.value}>
            {template.label}
          </option>
        ))}
      </select>
    </div>
  )
}
