import { DataTypes, Model } from 'sequelize';



import sequelize from '../../../lib/db/config';





export class Grade extends Model {
  declare id: number;
  declare value: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Grade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Grade",
    tableName: "grades",
  },
);

export default Grade;