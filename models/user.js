'use strict';
const {
  DataTypes, Model
} = require('sequelize');
const sequelize = require('../config/db.local.config'); // connect to database railway
module.exports = () => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    alamat: DataTypes.STRING,
    email: DataTypes.STRING,
    nomor_telepon: DataTypes.STRING,
    otp: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};