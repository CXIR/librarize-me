'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    barCode: {
      // EAN or ISBN product code
      type : DataTypes.STRING
    },
    name: {
      type : DataTypes.STRING
    },
    add_date: {
      type : DataTypes.DATE
    },
    productType: {
      type : DataTypes.STRING
    },
    ASINCode: {
      // Specific Amazon code
      type : DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Product.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.name = this.name;
        result.add_date = this.add_date;
        result.barCode = this.barCode;
        result.productType = this.productType;
        result.asin = this.ASINCode;
        return result;
      }
    }
  });
  return Product;
};
