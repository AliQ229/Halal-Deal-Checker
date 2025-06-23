import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { DealInputs, DealResults } from '@/types/calculator';

// Import fonts from @fontsource
import InterRegular from '@fontsource/inter/files/inter-latin-400-normal.woff';
import InterMedium from '@fontsource/inter/files/inter-latin-500-normal.woff';
import InterSemiBold from '@fontsource/inter/files/inter-latin-600-normal.woff';
import InterBold from '@fontsource/inter/files/inter-latin-700-normal.woff';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: InterRegular, fontWeight: 400 },
    { src: InterMedium, fontWeight: 500 },
    { src: InterSemiBold, fontWeight: 600 },
    { src: InterBold, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 32,
    paddingBottom: 80, // Increased padding to accommodate fixed footer
    color: '#1E293B',
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'relative', // Needed for absolute positioning of the background
    color: '#ffffff',
    borderRadius: 12,
    marginBottom: 32,
    overflow: 'hidden', // Ensure background image respects border radius
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: 'Inter',
  },
  headerSubtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Inter',
  },
  section: {
    marginBottom: 24,
  },
  h2: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'Inter',
    marginBottom: 12,
    color: '#0f766e',
    borderBottomWidth: 2,
    borderBottomColor: '#0f766e',
    paddingBottom: 4,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColLabel: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
    padding: 8,
  },
  tableColValue: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
  },
  tableCellLabel: {
    fontWeight: 600,
  },
  tableCellValue: {
    textAlign: 'right',
  },
  highlight: {
    color: '#0f766e',
    fontWeight: 600,
  },
  dealStacksPass: {
    color: '#059669',
    fontWeight: 600,
  },
  dealStacksFail: {
    color: '#DC2626',
    fontWeight: 600,
  },

  footer: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    fontSize: 9,
    color: '#475569',
    textAlign: 'center',
  },
  footerLink: {
    color: '#0f766e',
    textDecoration: 'none',
    fontWeight: 500,
  },
});

interface PdfDocumentProps {
  results: DealResults;
  inputs: DealInputs;
  propertyName: string;
  images?: { yieldChart: string; breakdownChart: string; headerPattern: string; };
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ 
  results, 
  inputs, 
  propertyName, 
  images
}) => {
  const finalImages = images || { yieldChart: '', breakdownChart: '', headerPattern: '' };
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={finalImages.headerPattern} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
          <View style={{ position: 'relative', paddingHorizontal: 32, paddingVertical: 24 }}>
            <Text style={styles.headerTitle}>Halal Property Investment Report</Text>
            <View style={styles.headerSubtitle}>
              <Text>{propertyName}</Text>
              <Text>{today}</Text>
            </View>
          </View>
        </View>

        {/* Property & Financing Summary */}
        <View style={styles.section}>
          <Text style={styles.h2}>Property & Financing Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Purchase Price</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.purchasePrice.toLocaleString()}</Text></View>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Expected Rent</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.expectedRent.toLocaleString()} / {inputs.rentFrequency}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={{...styles.tableColLabel, width: '25%'}}><Text style={styles.tableCellLabel}>Financing Method</Text></View>
              <View style={{...styles.tableColValue, width: '75%'}}><Text style={{...styles.tableCellValue, textAlign: 'left'}}>{inputs.financingMethod.charAt(0).toUpperCase() + inputs.financingMethod.slice(1)}</Text></View>
            </View>
            {inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Deposit</Text></View>
                <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.deposit.toLocaleString()}</Text></View>
                <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Monthly Finance Cost</Text></View>
                <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.monthlyFinanceCost.toLocaleString()}</Text></View>
              </View>
            )}
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Stamp Duty</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.stampDuty.toLocaleString()}</Text></View>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Legal Fees</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.legalFees.toLocaleString()}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Refurb Costs</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.refurbCosts.toLocaleString()}</Text></View>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Other Upfront Costs</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{inputs.otherUpfrontCosts.toLocaleString()}</Text></View>
            </View>
          </View>
        </View>

        {/* Investment Summary */}
        <View style={styles.section}>
          <Text style={styles.h2}>Investment Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Gross Yield</Text></View>
              <View style={styles.tableColValue}><Text style={{...styles.tableCellValue, ...styles.highlight}}>{results.grossYield.toFixed(2)}%</Text></View>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Net Yield</Text></View>
              <View style={styles.tableColValue}><Text style={{...styles.tableCellValue, ...styles.highlight}}>{results.netYield.toFixed(2)}%</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>{results.annualAppreciationValue > 0 ? 'Total Return on Cash' : 'Return on Cash'}</Text></View>
              <View style={styles.tableColValue}><Text style={{...styles.tableCellValue, ...styles.highlight}}>{results.returnOnCash.toFixed(2)}%</Text></View>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>{results.annualAppreciationValue > 0 ? 'Annual Profit (from rent)' : 'Annual Profit'}</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{results.annualProfit.toLocaleString()}</Text></View>
            </View>
            {results.annualAppreciationValue > 0 && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Est. Annual Appreciation</Text></View>
                <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{results.annualAppreciationValue.toLocaleString()}</Text></View>
                <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Total Annual Return</Text></View>
                <View style={styles.tableColValue}><Text style={{...styles.tableCellValue, ...styles.highlight}}>£{results.totalAnnualReturn.toLocaleString()}</Text></View>
              </View>
            )}
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Startup Costs</Text></View>
              <View style={styles.tableColValue}><Text style={styles.tableCellValue}>£{results.totalStartupCosts.toLocaleString()}</Text></View>
              <View style={styles.tableColLabel}><Text style={styles.tableCellLabel}>Deal Stacks?</Text></View>
              <View style={styles.tableColValue}><Text style={{...styles.tableCellValue, ...(results.dealStacks ? styles.dealStacksPass : styles.dealStacksFail)}}>{results.dealStacks ? '✅ Pass' : '❌ Fail'}</Text></View>
            </View>
          </View>
        </View>

{/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Report generated by Halal Deal Checker</Text>
          <Text>Need a reliable property manager? Property Intel can help.</Text>
          <Text style={styles.footerLink}>www.property-intel.co.uk</Text>
        </View>
      </Page>
    </Document>
  );
};
