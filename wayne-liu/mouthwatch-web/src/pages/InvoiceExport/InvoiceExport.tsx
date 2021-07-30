import * as React from 'react'

import { Document, Image, PDFDownloadLink, PDFViewer, Page, Text, View } from '@react-pdf/renderer'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import Button from '#/components/Button'
import ErrorBoundary from '#/components/ErrorBoundary'
import { InvoiceEntity } from '#/api'
import { format } from 'date-fns'
import { styles } from './pdfStylesheet'

const stylesForExport = require('./export.scss')

type ExpectedLocationState = Partial<InvoiceEntity>

const InvoiceExport: React.FC<RouteComponentProps> = (props) => {
  const { location } = props

  const invoiceData = location.state as ExpectedLocationState || null

  if (!invoiceData) {
    return <Redirect to='/' />
  }

  const { account, company, billing_address, number, created_at, line_items } = invoiceData

  const fileName = `${account.first_name}_${account.last_name}_${number}`
  const cityStateZip = billing_address.city && billing_address.state && billing_address.zip ?
    `${billing_address.city}, ${billing_address.state} ${billing_address.zip}`
    : null

  const renderHeader = () => {
    return (
      <View style={styles.section_details}>
        <View style={styles.invoice_details}>
          <Image style={styles.logo} source='/static/images/logo_horizontal_2020@1x.png' />
          <Text style={styles.text}>{billing_address.address1}</Text>
          {billing_address.address2 && <Text style={styles.text}>{billing_address.address2}</Text>}
          {cityStateZip && <Text style={styles.text}>{cityStateZip}</Text>}
          {billing_address.country && <Text style={styles.text}>{billing_address.country}</Text>}
          {billing_address.phone && <Text style={styles.text}>Phone: {billing_address.phone}</Text>}
          {billing_address.email && <Text style={styles.text}>Email: {billing_address.email}</Text>}
        </View>
        <View style={styles.invoice_details}>
          <Text style={styles.title}>Account Summary:</Text>
          <Text style={styles.text}>Statement #: {number}</Text>
          <Text style={styles.text}>Sent On: {format(created_at, 'MMM D, YYYY')}</Text>
          <Text style={styles.title}>Account Information:</Text>
          <Text style={styles.text}>{`${account.first_name} ${account.last_name}`}</Text>
          <Text style={styles.text}>{company}</Text>
        </View>
      </View>
    )
  }

  const renderLineItemHeader = () => (
    <View style={styles.line_items_header}>
      <Text style={styles.date}>Date</Text>
      <Text style={styles.description}>Item Description</Text>
      <Text style={styles.usage}>Usage</Text>
    </View>
  )

  const renderLineItems = () => {
    return line_items.map(item => {
      const isAddOn = item.product_code === 'Storage' || item.product_code === 'Users'
      const productCode = item.product_code.includes('essential') ? 'Essential' : 'Professional'

      return (
        <View style={styles.line_item} key={item.description}>
          <Text style={styles.date}>
            {`${format(item.start_date, 'MMM D')} - ${format(item.end_date, 'MMM D, YYYY')}`}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.usage}>{isAddOn ? item.usage_amount : productCode}</Text>
        </View>
      )
    })
  }

  const renderTotal = () => (
    <View style={styles.total}>
      <Text style={styles.text}>
        Your m*** subscription for the items listed herein will be
        invoiced by Henry Schein
      </Text>
    </View>
  )

  const renderPDF = () => (
    <Document title={fileName}>
      <Page style={styles.invoice}>
        <Text style={styles.fixed_header} fixed></Text>
        {renderHeader()}
        {renderLineItemHeader()}
        {renderLineItems()}
        {renderTotal()}
      </Page>
    </Document>
  )

  const renderButtonsForDraftPlan = () => {
    return (
      <>
        <Button className={stylesForExport.button} skinnyBtn>Download</Button>
      </>
    )
  }

  const doc = renderPDF()

  return (
    <ErrorBoundary>
      <PDFViewer style={{ width: '100%', height: '100vh' }}>
        {doc}
      </PDFViewer>
      <PDFDownloadLink document={doc} fileName={`${fileName}.pdf`} className={stylesForExport.downloadLink}>
        {
          ({ loading }) => (
            <div className={stylesForExport.buttonContainer}>
              {!loading && renderButtonsForDraftPlan()}
            </div>
          )
        }
      </PDFDownloadLink>
    </ErrorBoundary>
  )
}

export default InvoiceExport
