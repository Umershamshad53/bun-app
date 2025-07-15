import { NextResponse } from "next/server";
import { Op, fn, col } from "sequelize";
import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Revenue
    const totalPaid = await StudentFeeRecord.sum("paidAmount", {
      where: {
        status: {
          [Op.in]: ["paid", "partial"],
        },
      },
    });

    // 2. Active Students
    const activeStudentsResult = await StudentFeeRecord.findAll({
      attributes: [[fn("DISTINCT", col("studentId")), "studentId"]],
      where: {
        paidAmount: {
          [Op.gt]: 0,
        },
      },
    });
    const activeStudents = activeStudentsResult.length;

    // 3. Transactions Today
    const transactionsToday = await StudentFeeRecord.count({
      where: {
        paidDate: {
          [Op.gte]: today,
        },
      },
    });

    // 4. Pending Payments
    const pendingPayments = await StudentFeeRecord.count({
      where: {
        status: "unpaid",
      },
    });

    // 5. Monthly Revenue (last 6 months)
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 5); // includes current month
    sixMonthsAgo.setDate(1);

    const monthlyRevenue = (await StudentFeeRecord.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("paidDate"), "%Y-%m-01"), "month"],
        [fn("SUM", col("paidAmount")), "total"],
      ],
      where: {
        paidDate: {
          [Op.gte]: sixMonthsAgo,
        },
        status: {
          [Op.in]: ["paid", "partial"],
        },
      },
      group: [fn("DATE_FORMAT", col("paidDate"), "%Y-%m-01")],
      order: [[fn("DATE_FORMAT", col("paidDate"), "%Y-%m-01"), "ASC"]],
      raw: true,
    })) as unknown as Array<{ month: string; total: string | number }>;

    // Calculate monthly revenue change and trend
    let monthlyRevenueChange = 0;
    let monthlyRevenueTrend = "No Change";
    if (monthlyRevenue.length >= 2) {
      const prev = Number(monthlyRevenue[monthlyRevenue.length - 2].total);
      const curr = Number(monthlyRevenue[monthlyRevenue.length - 1].total);
      if (prev > 0) {
        monthlyRevenueChange = ((curr - prev) / prev) * 100;
        if (monthlyRevenueChange > 0) monthlyRevenueTrend = "Up";
        else if (monthlyRevenueChange < 0) monthlyRevenueTrend = "Down";
      }
    }

    // 6. Daily Transactions (current week)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const dailyTransactions = await StudentFeeRecord.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("paidDate"), "%a"), "day"],
        [fn("COUNT", "*"), "count"],
      ],
      where: {
        paidDate: {
          [Op.gte]: startOfWeek,
          [Op.lte]: today,
        },
      },
      group: [fn("DATE_FORMAT", col("paidDate"), "%a")],
      order: [[fn("MIN", col("paidDate")), "ASC"]],
      raw: true,
    });

    return NextResponse.json({
      totalRevenue: totalPaid || 0,
      activeStudents,
      transactionsToday,
      pendingPayments,
      monthlyRevenue,
      monthlyRevenueChange,
      monthlyRevenueTrend,
      dailyTransactions,
    });
  } catch (error) {
    console.error("❌ Error in dashboard API:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics" },
      { status: 500 },
    );
  }
}
