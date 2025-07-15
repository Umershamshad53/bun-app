import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

import { User } from "@/features/common/models/User";
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

    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const alreadyExist = await User.findOne({
      where: {
        email: body.email,
        id: { [Op.ne]: id },
      },
    });

    if (alreadyExist) {
      throw new ConflictError("Same email already exists!");
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    await user.update(body);

    return NextResponse.json(user); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("PUT /user/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function DELETE(_: NextRequest, { params }: ParameterId) {
  try {
    const { id } = await params;
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("User not found");

    await user.destroy();
    return NextResponse.json({ message: "User deleted successfully" }); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("DELETE /User/:id error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
