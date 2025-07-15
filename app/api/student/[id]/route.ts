import { NextRequest, NextResponse } from "next/server";

import Student from "@/features/common/models/Student";
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

    const student = await Student.findByPk(id);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    await student.update(body);
    return NextResponse.json(student);
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /students/[id] error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const student = await Student.findByPk(id);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    await student.destroy();
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /students/[id] error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
