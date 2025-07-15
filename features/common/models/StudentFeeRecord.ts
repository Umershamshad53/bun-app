import { DataTypes, Model } from "sequelize";

import sequelize from "@/lib/db/config";

export class StudentFeeRecord extends Model {
  declare id: number;
  declare studentId: number;
  declare month: string;
  declare amount: number;
  declare status: "paid" | "unpaid" | "partial";
  declare dueDate: Date;
  declare paidAmount: number;
  declare paidDate: Date | null;
  declare fineAmount: number;
  declare discount: number;
  declare feeBreakdown: {
    name: string;
    amount: number;
    discount: number;
    finalAmount: number;
  }[];
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentFeeRecord.init(
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
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("paid", "unpaid", "partial"),
      defaultValue: "unpaid",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fineAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    feeBreakdown: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "StudentFeeRecord",
    tableName: "studentFeeRecords",
  },
);

export default StudentFeeRecord;