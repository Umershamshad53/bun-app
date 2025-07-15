import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

import FeeStructure from "@/features/common/models/FeeStructure";
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

    const feeStructure = await FeeStructure.findByPk(id);
    if (!feeStructure) throw new NotFoundError("Fee Structure not found");

    // Prevent duplication of the same classId + feeTypeId combination (excluding current id)
    const alreadyExist = await FeeStructure.findOne({
      where: {
        classId: body.classId,
        feeTypeId: body.feeTypeId,
        id: { [Op.ne]: id },
      },
    });
    if (alreadyExist)
      throw new ConflictError(
        "Fee Structure with this Class and Fee Type already exists!",
      );

    await feeStructure.update(body);
    return NextResponse.json(feeStructure); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /fee-structure/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const feeStructure = await FeeStructure.findByPk(id);
    if (!feeStructure) throw new NotFoundError("Fee Structure not found");

    await feeStructure.destroy();
    return NextResponse.json({ message: "Fee Structure deleted successfully" }); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /fee-structure/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function GET(request: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;

    const feeStructure = await FeeStructure.findOne({ where: { classId: id } });
    if (!feeStructure) throw new NotFoundError("Fee Structure not found");

    return NextResponse.json(feeStructure); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("GET /fee-structure/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
