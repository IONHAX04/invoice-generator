import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { NOTE_TEXT } from '../constants/defaults'
import type { InvoiceData } from '../types/invoice'
import { calculateSummary, getItemSubtotal, getItemTotal } from '../utils/invoice'

interface InvoicePdfDocumentProps {
  data: InvoiceData
  stampSrc: string
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, color: '#0f172a' },
  classic: { border: '1 solid #cbd5e1', borderRadius: 4, padding: 14 },
  modern: { border: '1 solid #e2e8f0', borderRadius: 10, padding: 14, backgroundColor: '#f8fafc' },
  gst: { border: '2 solid #1e293b', borderRadius: 3, padding: 14 },
  compact: { border: '1 solid #cbd5e1', borderRadius: 6, padding: 12, fontSize: 9 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  rowStart: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  stamp: { width: 44, height: 44, objectFit: 'contain' },
  title: { fontSize: 15, fontWeight: 700, marginBottom: 2 },
  section: { marginTop: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderTop: '1 solid #cbd5e1' },
  tableRow: { flexDirection: 'row', borderTop: '1 solid #e2e8f0' },
  cell: { paddingVertical: 4, paddingHorizontal: 3, borderRight: '1 solid #e2e8f0' },
  right: { textAlign: 'right' },
  note: { marginTop: 10, backgroundColor: '#fef3c7', padding: 8, borderRadius: 4, fontSize: 9 },
})

const colWidths = ['7%', '31%', '12%', '10%', '10%', '15%', '15%']

const currency = (value: number) => `Rs ${value.toFixed(2)}`

export function InvoicePdfDocument({ data, stampSrc }: InvoicePdfDocumentProps) {
  const summary = calculateSummary(data.items)
  const templateStyles = {
    classic: styles.classic,
    modern: styles.modern,
    gst: styles.gst,
    compact: styles.compact,
  }

  const tableHeaderBg = {
    classic: '#e2e8f0',
    modern: '#c7d2fe',
    gst: '#0f172a',
    compact: '#a7f3d0',
  }[data.selectedTemplate]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={templateStyles[data.selectedTemplate]}>
          <View style={styles.row}>
            <View style={styles.rowStart}>
              <Image src={stampSrc} style={styles.stamp} />
              <View>
                <Text style={{ fontSize: 8 }}>FROM</Text>
                <Text style={styles.title}>{data.form.companyName || 'Your Company'}</Text>
                <Text>{data.form.address || 'Company address'}</Text>
                <Text>
                  {data.form.phone || 'Phone'} | {data.form.email || 'Email'}
                </Text>
                <Text>GST: {data.form.gstNumber || '-'}</Text>
              </View>
            </View>
            <View>
              <Text>Quotation: {data.form.quotationNumber}</Text>
              <Text>Date: {data.form.date}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text>To: {data.form.customerName || '-'}</Text>
            <Text>{data.form.customerAddress || '-'}</Text>
          </View>

          <View style={styles.section}>
            <View style={[styles.tableHeader, { backgroundColor: tableHeaderBg }]}>
              {['S.No', 'Description', 'Price', 'Qty', 'Tax %', 'Subtotal', 'Total'].map(
                (head, index) => (
                  <Text
                    key={head}
                    style={[
                      styles.cell,
                      { width: colWidths[index], fontWeight: 600, color: data.selectedTemplate === 'gst' ? '#ffffff' : '#0f172a' },
                      styles.right,
                    ]}
                  >
                    {head}
                  </Text>
                ),
              )}
            </View>
            {data.items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <Text style={[styles.cell, { width: colWidths[0] }]}>{index + 1}</Text>
                <Text style={[styles.cell, { width: colWidths[1] }]}>{item.description || '-'}</Text>
                <Text style={[styles.cell, { width: colWidths[2] }, styles.right]}>
                  {currency(item.price)}
                </Text>
                <Text style={[styles.cell, { width: colWidths[3] }, styles.right]}>{item.quantity}</Text>
                <Text style={[styles.cell, { width: colWidths[4] }, styles.right]}>{item.tax}</Text>
                <Text style={[styles.cell, { width: colWidths[5] }, styles.right]}>
                  {currency(getItemSubtotal(item))}
                </Text>
                <Text style={[styles.cell, { width: colWidths[6] }, styles.right]}>
                  {currency(getItemTotal(item))}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.section, { alignItems: 'flex-end' }]}>
            <Text>Subtotal: {currency(summary.subtotal)}</Text>
            <Text>Total Tax: {currency(summary.totalTax)}</Text>
            <Text style={{ fontWeight: 700 }}>Grand Total: {currency(summary.grandTotal)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>Delivery Terms</Text>
            <Text>{data.form.deliveryTerms}</Text>
          </View>

          <View
            style={[
              styles.note,
              {
                backgroundColor:
                  data.selectedTemplate === 'modern'
                    ? '#e0e7ff'
                    : data.selectedTemplate === 'gst'
                      ? '#e2e8f0'
                      : data.selectedTemplate === 'compact'
                        ? '#d1fae5'
                        : '#fef3c7',
              },
            ]}
          >
            <Text>{NOTE_TEXT}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
