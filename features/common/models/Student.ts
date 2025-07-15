import { DataTypes, Model, Optional } from "sequelize";



import sequelize from "../../../lib/db/config";





// Interface for the FeeType embedded JSON field
export interface FeeType {
  name: string;
  amount: number;
  discount: number;
  paymentType: string;
}

// Interface representing attributes of the Student model
interface StudentAttributes {
  id: number;
  rollNo: string;
  fullName: string;
  grade: number;
  class: number;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  status: string;
  studentAnnualFee: number;
  discount: FeeType[];
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentCreationAttributes = Optional<StudentAttributes, "id">;

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  id!: number;
  rollNo!: string; 
  fullName!: string;
  grade!: number;
  class!: number;
  email!: string;
  phone!: string;
  address!: string;
  guardianName!: string;
  guardianPhone!: string;
  status!: string;
  studentAnnualFee!: number;
  discount!: FeeType[];
  createdAt!: Date;
  updatedAt!: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rollNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "grades",
        key: "id",
      },
    },
    class: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "classes",
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    guardianName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guardianPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentAnnualFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true,
  },
);

export default Student;