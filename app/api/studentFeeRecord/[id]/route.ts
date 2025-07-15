import { NextRequest, NextResponse } from "next/server";

import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";
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

    const record = await StudentFeeRecord.findByPk(id);
    if (!record) {
      throw new NotFoundError("Student fee record not found");
    }

    await record.update(body);
    return NextResponse.json(record);
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /student-fee-record/[id] error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const record = await StudentFeeRecord.findByPk(id);
    if (!record) {
      throw new NotFoundError("Student fee record not found");
    }

    await record.destroy();
    return NextResponse.json({
      message: "Student fee record deleted successfully",
    });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /student-fee-record/[id] error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
