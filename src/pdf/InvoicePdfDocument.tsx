import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { NOTE_TEXT } from '../constants/defaults'
import type { InvoiceData } from '../types/invoice'
import { calculateSummary, getEnteredQtyCost, getItemTotal } from '../utils/invoice'

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
  headerCenter: { alignItems: 'center', marginBottom: 8 },
  stamp: { width: 44, height: 44, objectFit: 'contain', marginBottom: 4 },
  headerText: { textAlign: 'center', width: '100%' },
  title: { fontSize: 15, fontWeight: 700, marginBottom: 2 },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  quoteRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  section: { marginTop: 10 },
  tableHeader: { flexDirection: 'row', borderTop: '1 solid #cbd5e1' },
  tableRow: { flexDirection: 'row', borderTop: '1 solid #e2e8f0' },
  cell: { paddingVertical: 4, paddingHorizontal: 2, borderRight: '1 solid #e2e8f0' },
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },
  center: { textAlign: 'center' },
  note: { marginTop: 10, padding: 8, borderRadius: 4, fontSize: 9 },
})

/** 8 columns — widths sum to 100% */
const colWidths = ['5%', '33%', '10%', '10%', '8%', '12%', '9%', '13%']

const currency = (value: number) => `Rs ${value.toFixed(2)}`

const tableHeaders = [
  'S.No',
  'Description',
  'HSN',
  'Per unit',
  'Qty',
  'Entered qty cost',
  'Tax %',
  'Total',
]

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

  const headerTextColor = data.selectedTemplate === 'gst' ? '#ffffff' : '#0f172a'

  const cellStyle = (index: number, align: 'left' | 'right' | 'center') => [
    styles.cell,
    { width: colWidths[index] },
    align === 'left' ? styles.left : align === 'right' ? styles.right : styles.center,
  ]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={templateStyles[data.selectedTemplate]}>
          {/* Centered header (PDF only) + divider like web preview */}
          <View style={styles.headerCenter}>
            <Image src={stampSrc} style={styles.stamp} />
            <View style={styles.headerText}>
              <Text style={{ fontSize: 8, marginBottom: 2 }}>FROM</Text>
              <Text style={styles.title}>{data.form.companyName || 'Your Company'}</Text>
              <Text>{data.form.address || 'Company address'}</Text>
              <Text>
                {data.form.phone || 'Phone'} | {data.form.email || 'Email'}
              </Text>
              <Text>GST: {data.form.gstNumber || '-'}</Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.quoteRow}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text>Quotation: {data.form.quotationNumber}</Text>
              <Text>Date: {data.form.date}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>To</Text>
            <Text>{data.form.customerName || '-'}</Text>
            <Text>{data.form.customerAddress || '-'}</Text>
          </View>

          <View style={styles.section}>
            <View style={[styles.tableHeader, { backgroundColor: tableHeaderBg }]}>
              {tableHeaders.map((head, index) => (
                <Text
                  key={head}
                  style={[
                    styles.cell,
                    { width: colWidths[index], fontWeight: 600, color: headerTextColor },
                    index === 0 ? styles.center : index === 1 ? styles.left : styles.right,
                  ]}
                >
                  {head}
                </Text>
              ))}
            </View>
            {data.items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <Text style={cellStyle(0, 'center')}>{index + 1}</Text>
                <Text style={cellStyle(1, 'left')}>{item.description || '-'}</Text>
                <Text style={cellStyle(2, 'right')}>{item.hsnCode || '-'}</Text>
                <Text style={cellStyle(3, 'right')}>{currency(item.price)}</Text>
                <Text style={cellStyle(4, 'right')}>{item.quantity}</Text>
                <Text style={cellStyle(5, 'right')}>{currency(getEnteredQtyCost(item))}</Text>
                <Text style={cellStyle(6, 'right')}>{item.tax}</Text>
                <Text style={cellStyle(7, 'right')}>{currency(getItemTotal(item))}</Text>
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
