import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

import { StudentFeeType } from "@/features/common/models/StudentFeeType";
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
    const feeType = await StudentFeeType.findByPk(id);
    if (!feeType) throw new NotFoundError("Fee Type not found");

    const alreadyExist = await StudentFeeType.findOne({
      where: { feeName: body.feeName, id: { [Op.ne]: id } },
    });
    if (alreadyExist)
      throw new ConflictError("Same Name Fee Type Already Exist!");

    await feeType.update(body);
    return NextResponse.json(feeType); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /Fee Type/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;
    const feeType = await StudentFeeType.findByPk(id);
    if (!feeType) throw new NotFoundError("Fee Type not found");

    await feeType.destroy();
    return NextResponse.json({ message: "Fee Type deleted successfully" }); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /Fee Type/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
