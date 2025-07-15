import { NextRequest, NextResponse } from "next/server";

import Class from "@/features/common/models/Class";
import {
  ApiError,
  ConflictError,
  InternalServerError,
} from "@/lib/errors/ApiError";

/**
 * GET /api/class
 * Fetch all classes excluding createdAt and updatedAt timestamps.
 */
export async function GET() {
  try {
    const classes = await Class.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    const cleanedClasses = classes.map((cls) => {
      let feeTypes = cls.feeTypes;

      if (typeof feeTypes === "string") {
        try {
          feeTypes = JSON.parse(feeTypes);
        } catch {
          feeTypes = []; // fallback in case of invalid JSON
        }
      }

      return {
        id: cls.id,
        value: cls.value,
        feeTypes,
      };
    });

    return NextResponse.json(cleanedClasses);
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("Error fetching classes:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
/**
 * POST /api/class
 * Create a new class if it doesn't already exist.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.value || !Array.isArray(body.feeTypes)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const exists = await Class.findOne({ where: { value: body.value } });

    if (exists) {
      throw new ConflictError("Same name class already exists.");
    }

    const newClass = await Class.create({
      value: body.value,
      feeTypes: body.feeTypes,
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("Error creating class:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
