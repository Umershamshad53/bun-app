import { NextRequest, NextResponse } from "next/server";

import StudentFeePayment from "@/features/common/models/StudentFeePayment";
import {
  ApiError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors/ApiError";
import { ParameterId } from "@/type/api";

export async function PUT(request: NextRequest, { params }: ParameterId) {
  try {
    const body = await request.json();
    const { id } = await params;

    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError("Update payload is required");
    }

    const payment = await StudentFeePayment.findByPk(id);
    if (!payment) {
      throw new NotFoundError("Student fee payment not found");
    }

    await payment.update(body);
    return NextResponse.json(payment);
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /student-fee-payment/[id] error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const payment = await StudentFeePayment.findByPk(id);
    if (!payment) {
      throw new NotFoundError("Student fee payment not found");
    }

    await payment.destroy();
    return NextResponse.json({
      message: "Student fee payment deleted successfully",
    });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /student-fee-payment/[id] error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
