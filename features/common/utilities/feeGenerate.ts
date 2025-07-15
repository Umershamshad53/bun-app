import dayjs from "dayjs";



import Student from "@/features/common/models/Student";
import StudentFeeRecord from "@/features/common/models/StudentFeeRecord";





interface FeeDiscount {
  name: string;
  amount: number;
  discount: number;
  paymentType?: string;
}

export async function generateMonthlyStudentFees() {
  console.log("📆 Running monthly student fee generation...");

  const currentMonth = dayjs().format("YYYY-MM");
  const students = await Student.findAll({
    where: { status: "Active" },
  });

  for (const student of students) {
    const exists = await StudentFeeRecord.findOne({
      where: {
        studentId: student.id,
        month: currentMonth,
      },
    });

    if (exists) {
      console.log(`✅ Fee already exists for student ${student.id} - ${currentMonth}`);
      continue;
    }

    let feeTypes: FeeDiscount[] = [];

    if (student.discount) {
      try {
        feeTypes = typeof student.discount === "string" ? JSON.parse(student.discount) : student.discount;
      } catch {
        console.error("❌ Invalid JSON in student.discount:", student.discount);
        feeTypes = [];
      }
    }

    const monthlyFees = feeTypes.filter((fee) => fee.paymentType === "Monthly");

    let totalAmount = 0;
    let totalDiscount = 0;

    const feeBreakdown: {
      name: string;
      amount: number;
      discount: number;
      finalAmount: number;
      type: string;
    }[] = [];

    for (const fee of monthlyFees) {
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
      studentId: student.id,
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

    console.log(`💸 Fee generated for student ${student.id} for ${currentMonth} — Rs.${totalAmount}`);
  }

  console.log("✅ Monthly student fee generation complete.");
}