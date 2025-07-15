import "@/features/common/models/Class";
import "@/features/common/models/FeeStructure";
import "@/features/common/models/Grade";
import "@/features/common/models/Student";
import "@/features/common/models/StudentFeePayment";
import "@/features/common/models/StudentFeeRecord";
import "@/features/common/models/StudentFeeType";
import "@/features/common/models/User";



import sequelize from "./config";





const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected and models synced");
  } catch (error) {
    console.error("❌ DB init error:", error);
  }
};

export default initializeDatabase;