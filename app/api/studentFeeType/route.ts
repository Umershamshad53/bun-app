import { NextRequest, NextResponse } from "next/server";

import StudentFeeType, {
  PaymentType,
} from "@/features/common/models/StudentFeeType";
import initializeDatabase from "@/lib/db/init";

await initializeDatabase();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentType = searchParams.get("paymentType");

    const whereClause =
      paymentType &&
      Object.values(PaymentType).includes(paymentType as PaymentType)
        ? { paymentType }
        : {};

    const feeTypes = await StudentFeeType.findAll({
      where: whereClause,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return NextResponse.json(feeTypes);
  } catch (error) {
    console.error("Error fetching fee types:", error);
    return NextResponse.json(
      { error: "Failed to fetch Fee Types" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feeName, feeDescription, feeRequired, feeAmount, paymentType } =
      body;

    if (!Object.values(PaymentType).includes(paymentType)) {
      return NextResponse.json(
        { error: "Invalid payment type provided." },
        { status: 400 },
      );
    }

    const alreadyExist = await StudentFeeType.findOne({ where: { feeName } });
    if (alreadyExist) {
      return NextResponse.json(
        { error: "Fee type with the same name already exists." },
        { status: 409 },
      );
    }

    const feeType = await StudentFeeType.create({
      feeName,
      feeDescription,
      feeRequired,
      feeAmount,
      paymentType,
    });

    return NextResponse.json(feeType, { status: 201 });
  } catch (error) {
    console.error("Error creating student fee type:", error);
    return NextResponse.json(
      { error: "Failed to create student fee type" },
      { status: 500 },
    );
  }
}
