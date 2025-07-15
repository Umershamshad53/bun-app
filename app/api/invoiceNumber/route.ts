import { NextResponse, NextRequest } from "next/server";
import { Op, WhereOptions } from "sequelize";
import Student from "@/features/common/models/Student";
import StudentFeePayment from "@/features/common/models/StudentFeePayment";
import {
  ApiError,
  InternalServerError,
  NotFoundError,
} from "@/lib/errors/ApiError";
import { generateQRCode } from "@/lib/utils";

StudentFeePayment.belongsTo(Student, {
  foreignKey: "studentFeeId",
  as: "student",
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: WhereOptions = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      Object.assign(where, {
        createdAt: {
          [Op.between]: [start, end],
        },
      });
    }

    const studentWhere: WhereOptions = {};

    if (search) {
      Object.assign(studentWhere, {
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { rollNo: { [Op.like]: `%${search}%` } },
          { id: isNaN(Number(search)) ? -1 : Number(search) },
        ],
      });
    }

    const { count, rows: payments } = await StudentFeePayment.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Student,
          as: "student",
          where:
            Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
        },
      ],
    });

    if (!payments || payments.length === 0) {
      throw new NotFoundError("No student fee payments found");
    }

    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        const qrCode = await generateQRCode(payment.fbrInvoiceNo);
        return {
          ...payment.toJSON(),
          qrCode,
        };
      }),
    );

    return NextResponse.json({
      data: enrichedPayments,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("GET /student-fee-payment error:", err);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
