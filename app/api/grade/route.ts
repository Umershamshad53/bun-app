import { NextRequest, NextResponse } from "next/server";

import { Grade } from "@/features/common/models/Grade";
import {
  ApiError,
  ConflictError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors/ApiError";

export async function GET() {
  try {
    const grades = await Grade.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return NextResponse.json(grades); // 200 OK
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("GET /grades error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.value?.trim()) {
      throw new ValidationError('Grade "value" is required');
    }

    const alreadyExist = await Grade.findOne({ where: { value: body.value } });
    if (alreadyExist) {
      throw new ConflictError("Same Name Grade Already Exist!");
    }

    const newGrade = await Grade.create({ value: body.value });

    return NextResponse.json(newGrade, { status: 201 });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("POST /grades error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
