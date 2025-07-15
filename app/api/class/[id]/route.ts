import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

import { Class } from "@/features/common/models/Class";
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
    const stdClass = await Class.findByPk(id);
    if (!stdClass) throw new NotFoundError("Class not found");

    const alreadyExist = await Class.findOne({
      where: { value: body.value, id: { [Op.ne]: id } },
    });
    if (alreadyExist) throw new ConflictError("Same Name Class Already Exist!");

    await stdClass.update(body);
    return NextResponse.json(stdClass); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /classes/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const stdClass = await Class.findByPk(id);
    if (!stdClass) {
      throw new NotFoundError("Class not found");
    }

    const studentCount = await Student.count({ where: { class: stdClass.id } });
    if (studentCount > 0) {
      throw new NotFoundError(
        "Cannot delete class: Students are assigned to it",
      );
    }

    await stdClass.destroy();

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /classes/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function GET(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const stdClass = await Class.findByPk(id);

    if (!stdClass) throw new NotFoundError("Class not found");

    // Parse feeTypes JSON string into object
    let feeTypes = [];
    try {
      feeTypes =
        typeof stdClass.feeTypes === "string"
          ? JSON.parse(stdClass.feeTypes)
          : stdClass.feeTypes;
    } catch {
      console.error("❌ Invalid JSON in class.feeTypes:", stdClass.feeTypes);
      feeTypes = [];
    }

    return NextResponse.json({
      class: {
        ...stdClass.toJSON(),
        feeTypes, // parsed array instead of raw string
      },
    });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("GET /classes/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
