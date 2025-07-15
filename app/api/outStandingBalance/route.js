import { NextResponse } from "next/server";

import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";

export async function GET() {
  try {
    const feeRecords = await StudentFeeRecord.findAll({
      where: {
        status: "unpaid",
      },
      attributes: ["amount", "paidAmount"],
    });

    const overallOutstandingBalance = feeRecords.reduce((total, record) => {
      const amount = record.amount ?? 0;
      const paid = record.paidAmount ?? 0;
      return total + (amount - paid);
    }, 0);

    return NextResponse.json({ overallOutstandingBalance });
  } catch (error) {
    console.error("❌ Error fetching overall outstanding balance:", error);
    return NextResponse.json(
      { error: "Failed to calculate outstanding balance" },
      { status: 500 },
    );
  }
}
