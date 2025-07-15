import { NextRequest, NextResponse } from "next/server";
import { WhereOptions } from "sequelize";

import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";
import {
  ApiError,
  ConflictError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors/ApiError";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const month = searchParams.get("month"); // Optional filter

    const whereClause: WhereOptions = {};

    if (studentId) {
      const id = Number(studentId);
      if (isNaN(id)) {
        return NextResponse.json(
          { error: "Invalid studentId" },
          { status: 400 },
        );
      }
      whereClause.studentId = id;
    }

    if (month) {
      whereClause.month = month;
    }

    const records = await StudentFeeRecord.findAll({
      where: whereClause,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["dueDate", "ASC"]],
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /student-fee-record error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student fee records" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, feeTypeId, amount, dueDate, isPaid } = body ?? {};

    if (!studentId || !feeTypeId || !amount) {
      throw new ValidationError(
        "studentId, feeTypeId, and amount are required",
      );
    }

    const alreadyExist = await StudentFeeRecord.findOne({
      where: {
        studentId,
        feeTypeId,
      },
    });

    if (alreadyExist) {
      throw new ConflictError(
        "Fee record already exists for this student and fee type",
      );
    }

    const newRecord = await StudentFeeRecord.create({
      studentId,
      feeTypeId,
      amount,
      dueDate,
      isPaid: isPaid ?? false,
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("POST /student-fee-record error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
