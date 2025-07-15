import { NextRequest, NextResponse } from "next/server";

import FeeStructure from "@/features/common/models/FeeStructure";
import StudentFeeType from "@/features/common/models/StudentFeeType";

export async function GET() {
  try {
    // Fetch all fee structures
    const feeStructures = await FeeStructure.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    // Collect all feeTypeIds into a Set
    const allFeeTypeIds = new Set<number>();

    for (const feeStructure of feeStructures) {
      let ids: number[] = [];

      if (typeof feeStructure.feeTypeId === "string") {
        try {
          const parsed = JSON.parse(feeStructure.feeTypeId);
          if (Array.isArray(parsed)) {
            ids = parsed;
          }
        } catch {
          console.warn("Invalid JSON in feeTypeId:", feeStructure.feeTypeId);
        }
      } else if (Array.isArray(feeStructure.feeTypeId)) {
        ids = feeStructure.feeTypeId;
      }

      ids.forEach((id) => allFeeTypeIds.add(id));
    }

    // Fetch all fee type details
    const feeTypes = await StudentFeeType.findAll({
      where: { id: Array.from(allFeeTypeIds) },
      raw: true,
    });

    const feeTypeMap = Object.fromEntries(feeTypes.map((ft) => [ft.id, ft]));

    // Enrich the fee structures with full fee type data
    const enrichedFeeStructures = feeStructures.map((feeStructure) => {
      let ids: number[] = [];

      if (typeof feeStructure.feeTypeId === "string") {
        try {
          const parsed = JSON.parse(feeStructure.feeTypeId);
          if (Array.isArray(parsed)) {
            ids = parsed;
          }
        } catch {
          ids = [];
        }
      } else if (Array.isArray(feeStructure.feeTypeId)) {
        ids = feeStructure.feeTypeId;
      }

      return {
        ...feeStructure,
        feeTypes: ids.map((id) => feeTypeMap[id]).filter(Boolean),
      };
    });

    return NextResponse.json(enrichedFeeStructures);
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    return NextResponse.json(
      { error: "Failed to fetch Fee Structures" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { classId, feeTypeId, amount } = body;

    // Prevent duplicate classId + feeTypeId combo
    const alreadyExist = await FeeStructure.findOne({
      where: {
        classId,
        feeTypeId,
      },
    });

    if (alreadyExist) {
      return NextResponse.json(
        { error: "Fee Structure already exists for this Class and Fee Type" },
        { status: 409 },
      );
    }

    const newFeeStructure = await FeeStructure.create({
      classId,
      feeTypeId,
      amount,
    });
    return NextResponse.json(newFeeStructure, { status: 201 });
  } catch (error) {
    console.error("Error creating Fee Structure:", error);
    return NextResponse.json(
      { error: "Failed to create Fee Structure" },
      { status: 500 },
    );
  }
}
