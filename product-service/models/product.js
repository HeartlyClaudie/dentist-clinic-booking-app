// models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'products' // Ensures lowercase table name
});

module.exports = Product;
