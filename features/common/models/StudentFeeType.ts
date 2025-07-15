import { DataTypes, Model } from "sequelize";

import sequelize from "@/lib/db/config";

export enum PaymentType {
  MONTHLY = "Monthly",
  ONE_TIME = "one-time",
  ANNUAL = "Annually",
}

export class StudentFeeType extends Model {
  declare id: number;
  declare feeName: string;
  declare feeDescription: string;
  declare feeAmount: number;
  declare feeRequired: boolean;
  declare paymentType: PaymentType;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StudentFeeType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    feeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feeDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feeAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feeRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paymentType: {
      type: DataTypes.ENUM(...Object.values(PaymentType)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "StudentFeeType",
    tableName: "studentFeeTypes",
  },
);

export default StudentFeeType;
