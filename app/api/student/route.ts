import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { Includeable, Op, WhereOptions } from "sequelize";

import Class from "@/features/common/models/Class";
import Grade from "@/features/common/models/Grade";
import Student, { FeeType } from "@/features/common/models/Student";
import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";
import {
  ApiError,
  ConflictError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors/ApiError";

async function generateNextRollNo(): Promise<string> {
  const latestStudent = await Student.findOne({
    order: [["createdAt", "DESC"]],
    attributes: ["rollNo"],
  });

  if (!latestStudent || !latestStudent.rollNo) {
    return "R001";
  }

  const lastRollNo = latestStudent.rollNo;
  const lastNumber = parseInt(lastRollNo.replace("R", ""), 10);

  const nextNumber = lastNumber + 1;
  return `R${String(nextNumber).padStart(3, "0")}`; // R001, R002, ...
}

Student.belongsTo(Grade, { foreignKey: "grade", as: "gradeInfo" });
Student.belongsTo(Class, { foreignKey: "class", as: "classInfo" });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const classValue = searchParams.get("class") || "";
    const gradeValue = searchParams.get("grade") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const where: WhereOptions = {};

    if (search) {
      Object.assign(where, {
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { rollNo: { [Op.like]: `%${search}%` } },
          { id: isNaN(Number(search)) ? -1 : Number(search) },
        ],
      });
    }

    if (classValue || gradeValue) {
      const includeConditions: Includeable[] = [];

      if (classValue) {
        includeConditions.push({
          model: Class,
          as: "classInfo",
          where: { value: classValue },
          attributes: ["value"],
        });
      } else {
        includeConditions.push({
          model: Class,
          as: "classInfo",
          attributes: ["value"],
        });
      }

      if (gradeValue) {
        includeConditions.push({
          model: Grade,
          as: "gradeInfo",
          where: { value: gradeValue },
          attributes: ["value"],
        });
      } else {
        includeConditions.push({
          model: Grade,
          as: "gradeInfo",
          attributes: ["value"],
        });
      }

      // Get filtered students with pagination
      const { rows: students, count } = await Student.findAndCountAll({
        where,
        include: includeConditions,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        limit,
        offset,
      });

      // Add outstanding balance
      const enrichedStudents = await Promise.all(
        students.map(async (student) => {
          const feeRecords = await StudentFeeRecord.findAll({
            where: { studentId: student.id, status: "unpaid" },
            attributes: ["amount", "paidAmount"],
          });

          const outstandingBalance = feeRecords.reduce(
            (sum, rec) => sum + (rec.amount - rec.paidAmount),
            0,
          );

          return {
            ...student.get({ plain: true }),
            outstandingBalance,
          };
        }),
      );

      return NextResponse.json({
        students: enrichedStudents,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    }

    // fallback if no filters provided
    const { rows: students, count } = await Student.findAndCountAll({
      where,
      include: [
        {
          model: Grade,
          as: "gradeInfo",
          attributes: ["value"],
        },
        {
          model: Class,
          as: "classInfo",
          attributes: ["value"],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
      limit,
      offset,
    });

    const enrichedStudents = await Promise.all(
      students.map(async (student) => {
        const feeRecords = await StudentFeeRecord.findAll({
          where: { studentId: student.id },
          attributes: ["amount", "paidAmount"],
        });

        const outstandingBalance = feeRecords.reduce(
          (sum, rec) => sum + (rec.amount - rec.paidAmount),
          0,
        );

        return {
          ...student.get({ plain: true }),
          outstandingBalance,
        };
      }),
    );

    return NextResponse.json({
      students: enrichedStudents,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      grade,
      class: classValue,
      email,
      phone,
      address,
      guardianName,
      guardianPhone,
      studentAnnualFee,
      discount,
    } = body ?? {};

    if (!fullName || !grade || !classValue || !email) {
      throw new ValidationError(
        "fullName, grade, class, and email are required",
      );
    }

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      throw new ConflictError("Email already exists");
    }

    // Validate discount
    let parsedDiscount: FeeType[] = [];
    if (discount && Array.isArray(discount)) {
      for (const d of discount) {
        if (
          !d.name ||
          typeof d.amount !== "number" ||
          typeof d.discount !== "number"
        ) {
          throw new ValidationError(
            "Each discount must include name, amount, and discount (as numbers)",
          );
        }
      }
      parsedDiscount = discount;
    }

    const rollNo = await generateNextRollNo();

    const newStudent = await Student.create({
      rollNo,
      fullName,
      grade,
      class: classValue,
      email,
      phone,
      address,
      status: "Active",
      guardianName,
      guardianPhone,
      studentAnnualFee,
      discount: parsedDiscount,
    });

    // Fee breakdown
    let totalAmount = 0;
    let totalDiscount = 0;
    const feeBreakdown: {
      name: string;
      amount: number;
      discount: number;
      finalAmount: number;
      type: string;
    }[] = [];

    const currentMonth = dayjs().format("YYYY-MM");

    for (const fee of parsedDiscount) {
      const feeAmount = fee.amount || 0;
      const discountPercent = fee.discount || 0;
      const discountValue = (feeAmount * discountPercent) / 100;
      const finalAmount = Math.max(feeAmount - discountValue, 0);

      feeBreakdown.push({
        name: fee.name,
        amount: feeAmount,
        discount: discountPercent,
        finalAmount,
        type: "Monthly",
      });

      totalAmount += finalAmount;
      totalDiscount += discountValue;
    }

    await StudentFeeRecord.create({
      studentId: newStudent.id,
      month: currentMonth,
      amount: totalAmount,
      status: "unpaid",
      dueDate: dayjs().endOf("month").toDate(),
      paidAmount: 0,
      fineAmount: 0,
      discount: totalDiscount,
      feeBreakdown,
      paidDate: null,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("POST /students error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
