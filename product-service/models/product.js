// models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Enforce uniqueness at DB level
    set(value) {
      this.setDataValue('name', value.trim().toLowerCase());
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: true // Enable if you want createdAt/updatedAt
});

module.exports = Product;
