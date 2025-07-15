import { NextRequest, NextResponse } from "next/server";

import Student from "@/features/common/models/Student";
import StudentFeePayment from "@/features/common/models/StudentFeePayment";
import {
  ApiError,
  InternalServerError,
  NotFoundError,
} from "@/lib/errors/ApiError";
import { generateQRCode } from "@/lib/utils";
import { ParameterId } from "@/type/api";

export async function GET(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;
    const invoiceDetail = await StudentFeePayment.findAll({
      where: { receiptNo: id },
    });

    if (!invoiceDetail) throw new NotFoundError("StudentFeePayment not found");

    const studentDetail = await Student.findByPk(invoiceDetail[0].studentFeeId);

    // ✅ Generate QR code as Data URL (base64)
    const qrCodeDataUrl = await generateQRCode(invoiceDetail[0].fbrInvoiceNo);

    const data = {
      invoiceDetail,
      studentDetail,
      qrCode: qrCodeDataUrl,
    };

    return NextResponse.json({ data });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("GET /student-fee-payment/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
