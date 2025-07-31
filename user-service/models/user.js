const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // shared instance

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = User;
