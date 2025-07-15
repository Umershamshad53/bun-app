"use client";

import { useEffect, useState } from "react";
import FeeReceipt from "@/features/dashboard/screens/Recipt";
import { useSearchParams } from "next/navigation";
import { getReceipt } from "../../../features/dashboard/actions/receiptActions";

// --- Types ---
interface InvoiceDetail {
  id: number;
  studentFeeId: number;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  receiptNo: string;
  feeType: string;
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
  discount: string; // or DiscountItem[] if parsed
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptData {
  invoiceDetail: InvoiceDetail[];
  studentDetail: StudentDetail;
  qrCode: string;
}

// --- Hardcoded fallback data (optional) ---

export default function PrintReceiptPage() {
  const [res, setRes] = useState<ReceiptData | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const no = searchParams.get("receiptNo");

      if (no) {
        try {
          const response = await getReceipt(no);
          setRes(response.data.data); // assumes response.data is of type ReceiptData
        } catch (error) {
          console.error("Error fetching receipt:", error);
        }
      }

      // Optionally trigger print after slight delay
      setTimeout(() => {
        // window.print();
      }, 500);
    };

    fetchData();
  }, [searchParams]);

  return (
    <div className="print-container">{res && <FeeReceipt data={res} />}</div>
  );
}

// import React from "react";
// import { getReceipt } from "../../../features/dashboard/actions/receiptActions";
// import FeeReceipt from "@/features/dashboard/screens/Recipt";

// export default function PrintReceiptPage() {
//   const data = getReceipt("REC-0007");
//   console.log(data);
//   return <div className="print-container">{<FeeReceipt data={data} />}</div>;
// }
