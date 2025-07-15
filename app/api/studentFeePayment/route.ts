import { config } from "dotenv";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// import Class from "@/features/common/models/Class";
import Student from "@/features/common/models/Student";
import StudentFeePayment from "@/features/common/models/StudentFeePayment";
import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";
// import sequelize from "@/lib/db/config";
import {
  ApiError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors/ApiError";

config();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    const whereClause = studentId
      ? {
          studentId: {
            [Op.eq]: Number(studentId),
          },
        }
      : {};

    const payments = await StudentFeePayment.findAll({
      where: whereClause,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET /student-fee-payment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student fee payments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      feeRecordId,
      paymentDate,
      paymentMethod,
      feeTypes,
      feeBreakdown,
    } = body ?? {};
    console.log("🧾 Received feeTypes:", JSON.stringify(feeTypes, null, 2));
    console.log(
      "🔍 Received feeBreakdown:",
      JSON.stringify(feeBreakdown, null, 2),
    );
    const transformedFeeTypes = feeTypes.map(
      (fee: {
        name: string;
        type: string;
        amount: number;
        finalAmount: number;
      }) => ({
        name: fee.name,
        type: fee.type,
        amount: fee.amount,
        discount: 0,
        finalAmount: fee.amount,
      }),
    );

    const mergedFeeTypes = [...feeBreakdown, ...transformedFeeTypes];

    if (
      !studentId ||
      !feeRecordId ||
      !Array.isArray(feeBreakdown) ||
      feeBreakdown.length === 0
    ) {
      throw new ValidationError(
        "studentId, feeRecordId, and at least one feeType with amount are required",
      );
    }

    const feeRecord = await StudentFeeRecord.findByPk(feeRecordId);
    if (!feeRecord) throw new ValidationError("Fee record not found");

    const year = new Date().getFullYear();
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    const latestPaymentOfYear = await StudentFeePayment.findOne({
      where: {
        createdAt: {
          [Op.between]: [startOfYear, endOfYear],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const lastNumber = latestPaymentOfYear?.receiptNo
      ? parseInt(latestPaymentOfYear.receiptNo.split("-")[2], 10)
      : 0;

    const newReceiptNo = `REC-${year}-${String(lastNumber + 1).padStart(4, "0")}`;

    const now = new Date();

    let totalPaid = 0;
    for (const ft of mergedFeeTypes) {
      if (!ft.name || typeof ft.finalAmount !== "number") {
        throw new ValidationError("Each feeType must include type and amount");
      }
      totalPaid += ft.finalAmount;
    }

    const student = await Student.findByPk(studentId);
    if (!student) throw new ValidationError("Student not found");

    // Construct FBR payload
    const fbrItems = mergedFeeTypes.map(
      (ft: {
        name: string;
        type: string;
        amount: number;
        finalAmount: number;
      }) => ({
        ItemCode: `FT_${ft.name}`,
        ItemName: `${ft.name} Fee`,
        Quantity: 1,
        PCTCode: "IT_1011",
        TaxRate: 0,
        SaleValue: ft.finalAmount,
        TotalAmount: ft.finalAmount,
        TaxCharged: 0,
        Discount: 0,
        FurtherTax: 0,
        InvoiceType: 1,
        RefUSIN: null,
      }),
    );

    const apiPayload = {
      InvoiceNumber: newReceiptNo,
      POSID: process.env.FBR_POSID,
      USIN: process.env.FBR_POSID,
      DateTime: now.toISOString(),
      BuyerNTN: "",
      BuyerCNIC: "",
      BuyerName: student.fullName,
      BuyerPhoneNumber: "0000-0000000",
      items: fbrItems,
      TotalBillAmount: totalPaid,
      TotalQuantity: fbrItems.length,
      TotalSaleValue: totalPaid,
      TotalTaxCharged: 0,
      PaymentMode: paymentMethod === "Cash" ? 1 : 2,
      InvoiceType: 1,
    };

    const fbrUrl = process.env.FBR_URL;
    const fbrToken = process.env.FBR_AUTH_TOKEN;
    console.log("process.env.FBR_URLprocess.env.FBR_URL", process.env.FBR_URL);
    if (!fbrUrl || !fbrToken) {
      throw new Error(
        "FBR_URL or FBR_AUTH_TOKEN is not defined in environment variables",
      );
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const fbrRes = await fetch(fbrUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fbrToken}`,
      },
      body: JSON.stringify(apiPayload),
    });

    if (!fbrRes.ok) {
      const apiErrorText = await fbrRes.text();
      console.error("❌ FBR API failed:", apiErrorText);
      throw new Error("FBR API request failed");
    }

    const fbrData = await fbrRes.json();
    console.log("fbrDatafbrData", fbrData);
    const fbrInvoiceNumber = fbrData?.InvoiceNumber;

    console.log("fbrInvoiceNumberfbrInvoiceNumber", fbrInvoiceNumber);

    if (!fbrInvoiceNumber) {
      throw new Error("Missing InvoiceNumber in FBR response");
    }

    // ✅ FBR success — now start DB transaction
    //const result = await sequelize.transaction(async (t) => {
    const payments = [];

    for (const ft of mergedFeeTypes) {
      const payment = await StudentFeePayment.create(
        {
          studentFeeId: feeRecordId,
          studentId: studentId,
          amount: ft.amount,
          paymentMethod: paymentMethod ?? "Cash",
          paidAt: paymentDate ?? now,
          receiptNo: newReceiptNo,
          feeType: ft.name,
          fbrInvoiceNo: fbrInvoiceNumber,
        },
        // { transaction: t },
      );
      payments.push(payment);
    }

    const newPaidAmount = feeRecord.paidAmount + totalPaid;
    const newStatus: "paid" | "partial" =
      newPaidAmount >= feeRecord.amount - feeRecord.discount
        ? "paid"
        : "partial";

    await feeRecord.update(
      {
        paidAmount: newPaidAmount,
        paidDate: now,
        status: newStatus,
      },
      // { transaction: t },
    );

    // return payments;
    //   });

    console.log("paymentspayments", payments);
    return NextResponse.json(
      {
        payments,
        receiptNo: newReceiptNo,
      },
      { status: 201 },
    );
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("❌ POST /student-fee-payment error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
