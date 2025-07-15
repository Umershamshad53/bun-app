import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

import { Grade } from "@/features/common/models/Grade";
import Student from "@/features/common/models/Student";
import {
  ApiError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/lib/errors/ApiError";
import { ParameterId } from "@/type/api";

export async function PUT(request: NextRequest, { params }: ParameterId) {
  try {
    const body = await request.json();
    const { id } = await params;
    const grade = await Grade.findByPk(id);
    if (!grade) throw new NotFoundError("Grade not found");

    // prevent duplicate value on a different row
    const alreadyExist = await Grade.findOne({
      where: { value: body.value, id: { [Op.ne]: id } },
    });
    if (alreadyExist) throw new ConflictError("Same Name Grade Already Exist!");

    await grade.update(body);
    return NextResponse.json(grade); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /grades/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;
    const grade = await Grade.findByPk(id);
    if (!grade) throw new NotFoundError("Grade not found");

    const studentCount = await Student.count({ where: { class: grade.id } });
    if (studentCount > 0) {
      throw new NotFoundError(
        "Cannot delete class: Students are assigned to it",
      );
    }

    await grade.destroy();
    return NextResponse.json({ message: "Grade deleted successfully" }); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /grades/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
