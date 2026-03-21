import type { ProductItem } from '../types/invoice'
import { formatCurrency, getEnteredQtyCost, getItemTotal } from '../utils/invoice'

interface ProductTableProps {
  items: ProductItem[]
  onAddRow: () => void
  onDeleteRow: (id: string) => void
  onUpdateItem: (id: string, field: keyof ProductItem, value: string | number) => void
}

export function ProductTable({
  items,
  onAddRow,
  onDeleteRow,
  onUpdateItem,
}: ProductTableProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Products</h3>
        <button
          type="button"
          onClick={onAddRow}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          Add Row
        </button>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-medium text-slate-500">S.No {index + 1}</p>
            <input
              type="text"
              value={item.description}
              onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
              placeholder="Product Description"
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={item.hsnCode}
              onChange={(e) => onUpdateItem(item.id, 'hsnCode', e.target.value)}
              placeholder="HSN Code"
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500">Per unit cost</label>
                <input
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) => onUpdateItem(item.id, 'price', Number(e.target.value))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Qty</label>
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(item.id, 'quantity', Number(e.target.value))}
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500">Tax %</label>
              <input
                type="number"
                min={0}
                value={item.tax}
                onChange={(e) => onUpdateItem(item.id, 'tax', Number(e.target.value))}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Entered qty cost: {formatCurrency(getEnteredQtyCost(item))}</span>
              <span>Total: {formatCurrency(getItemTotal(item))}</span>
            </div>
            <button
              type="button"
              onClick={() => onDeleteRow(item.id)}
              disabled={items.length === 1}
              className="text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Delete Row
            </button>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-2 py-2">S.No</th>
              <th className="px-2 py-2">Description</th>
              <th className="px-2 py-2">HSN</th>
              <th className="px-2 py-2">Per unit</th>
              <th className="px-2 py-2">Qty</th>
              <th className="px-2 py-2">Entered qty cost</th>
              <th className="px-2 py-2">Tax %</th>
              <th className="px-2 py-2">Total</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-2 py-2 text-slate-600">{index + 1}</td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                    className="w-full min-w-[140px] rounded border border-slate-300 px-2 py-1.5 outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={item.hsnCode}
                    onChange={(e) => onUpdateItem(item.id, 'hsnCode', e.target.value)}
                    className="w-20 rounded border border-slate-300 px-2 py-1.5 outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(e) => onUpdateItem(item.id, 'price', Number(e.target.value))}
                    className="w-24 rounded border border-slate-300 px-2 py-1.5 outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className="w-20 rounded border border-slate-300 px-2 py-1.5 outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 text-slate-700">{formatCurrency(getEnteredQtyCost(item))}</td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={0}
                    value={item.tax}
                    onChange={(e) => onUpdateItem(item.id, 'tax', Number(e.target.value))}
                    className="w-20 rounded border border-slate-300 px-2 py-1.5 outline-none focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 text-slate-700">{formatCurrency(getItemTotal(item))}</td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onDeleteRow(item.id)}
                    disabled={items.length === 1}
                    className="text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
