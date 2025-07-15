import React from 'react';

interface FeeType {
  name: string;
  amount: number;
}

interface InvoiceDetail {
  id: number;
  studentFeeId: number;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  receiptNo: string;
  feeType: string | FeeType[];
  fbrInvoiceNo: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentDetail {
  id: number;
  fullName: string;
  grade: number;
  class: number;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  status: string;
  studentAnnualFee: number;
  discount: string;
  createdAt: string;
  updatedAt: string;
}

interface ReceiptData {
  invoiceDetail: InvoiceDetail[];
  studentDetail: StudentDetail;
  qrCode: string;
}

interface FeeReceiptProps {
  data: ReceiptData;
}

const FeeReceipt: React.FC<FeeReceiptProps> = ({ data }) => {
  const { invoiceDetail, studentDetail, qrCode } = data;

  if (!invoiceDetail || invoiceDetail.length === 0)
    return <div>No invoice data found.</div>;

  const firstInvoice = invoiceDetail[0];

  // Map fee items
  const feeItems: FeeType[] = invoiceDetail.map((inv) => ({
    name: typeof inv.feeType === "string" ? inv.feeType : "Unknown",
    amount: inv.amount,
  }));

  const totalAmount = feeItems.reduce((sum, item) => sum + item.amount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.container}>
      {/* ... header and school info stays the same ... */}

      {/* Receipt Info */}
      <div style={styles.section}>
        <div style={styles.row}>
          <span style={styles.label}>Receipt No:</span>
          <span style={styles.value}>{firstInvoice.receiptNo}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Date:</span>
          <span style={styles.value}>{formatDate(firstInvoice.paidAt)}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>FBR Invoice:</span>
          <span style={styles.value}>{firstInvoice.fbrInvoiceNo}</span>
        </div>
      </div>

      {/* Student Info */}
      {studentDetail && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>STUDENT INFORMATION</h3>
          <div style={styles.row}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{studentDetail.fullName}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Grade/Class:</span>
            <span style={styles.value}>
              Grade {studentDetail.grade} - Class {studentDetail.class}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Guardian:</span>
            <span style={styles.value}>{studentDetail.guardianName}</span>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>PAYMENT DETAILS</h3>

        {feeItems.map((item, index) => (
          <div key={index}>
            <div style={styles.row}>
              <span style={styles.label}>Fee Type:</span>
              <span style={styles.value}>{item.name}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Amount:</span>
              <span style={styles.value}>Rs. {item.amount.toFixed(2)}</span>
            </div>
            {index < feeItems.length - 1 && <div style={styles.divider}></div>}
          </div>
        ))}

        <div style={{ ...styles.row, marginTop: "3mm" }}>
          <span style={{ ...styles.label, fontWeight: "bold" }}>
            Total Paid:
          </span>
          <span style={{ ...styles.value, fontWeight: "bold" }}>
            Rs. {totalAmount.toFixed(2)}
          </span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Payment Method:</span>
          <span style={styles.value}>{firstInvoice.paymentMethod}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Payment Date:</span>
          <span style={styles.value}>{formatDate(firstInvoice.paidAt)}</span>
        </div>
      </div>

      {/* QR Code */}
      {qrCode && (
        <div style={styles.qrContainer}>
          <img src={qrCode} alt="QR Code" style={styles.qrCode} />
          <p style={styles.qrText}>Scan for verification</p>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.divider}></div>
        <p style={styles.footerText}>
          ** This is a computer generated receipt **
        </p>
        <p style={styles.footerText}>No signature required</p>
        <p style={styles.thankYou}>Thank you for your payment!</p>
      </div>
    </div>
  );
};


// Styles optimized for thermal printing (80mm width)
const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '80mm',
    padding: '5mm',
    fontSize: '10pt',
    fontFamily: "'Monaco', 'Courier New', monospace",
    lineHeight: 1.3
  },
  schoolHeader: {
    textAlign: 'center',
    marginBottom: '5mm'
  },
  logoPlaceholder: {
    height: '15mm',
    width: '15mm',
    backgroundColor: '#eee',
    margin: '0 auto',
    border: '1px dashed #ccc'
  },
  schoolName: {
    fontSize: '12pt',
    fontWeight: 'bold',
    margin: '3mm 0 1mm',
    padding: 0
  },
  schoolAddress: {
    margin: '1mm 0',
    padding: 0
  },
  schoolContact: {
    margin: '1mm 0',
    padding: 0
  },
  receiptHeader: {
    textAlign: 'center',
    margin: '5mm 0'
  },
  receiptTitle: {
    fontSize: '12pt',
    fontWeight: 'bold',
    margin: '0 0 3mm',
    padding: 0
  },
  divider: {
    borderTop: '1px dashed #000',
    margin: '3mm 0'
  },
  section: {
    marginBottom: '5mm'
  },
  sectionTitle: {
    fontSize: '10pt',
    fontWeight: 'bold',
    textDecoration: 'underline',
    margin: '0 0 2mm',
    padding: 0
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1mm'
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'left'
  },
  value: {
    textAlign: 'right',
    flexShrink: 0
  },
  qrContainer: {
    textAlign: 'center',
    margin: '5mm 0'
  },
  qrCode: {
    width: '40mm',
    height: '40mm',
    border: '1px solid #000'
  },
  qrText: {
    marginTop: '1mm',
    fontSize: '9pt'
  },
  footer: {
    textAlign: 'center',
    marginTop: '5mm'
  },
  footerText: {
    fontSize: '8pt',
    margin: '1mm 0'
  },
  thankYou: {
    fontWeight: 'bold',
    marginTop: '3mm'
  }
};

export default FeeReceipt;