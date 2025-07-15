import { DataTypes, Model } from "sequelize";



import sequelize from "@/lib/db/config";





export class StudentFeePayment extends Model {
  declare id: number;
  declare studentFeeId: number;
  declare amount: number;
  declare paymentMethod: string;
  declare paidAt: Date;
  declare receiptNo: string | null;
  declare feeType: string;
  declare fbrInvoiceNo: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentFeePayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentFeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receiptNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fbrInvoiceNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "StudentFeePayment",
    tableName: "studentFeePayments",
  }
);

export default StudentFeePayment;