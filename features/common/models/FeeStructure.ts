import { DataTypes, Model } from "sequelize";



import sequelize from "@/lib/db/config";





export class FeeStructure extends Model {
  declare id: number;
  declare classId: number;
  declare feeTypeId: number[];
  declare amount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

FeeStructure.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "classes",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    feeTypeId: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FeeStructure",
    tableName: "feeStructures",
  },
);

export default FeeStructure;