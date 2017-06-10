'use strict';
module.exports = function(sequelize, DataTypes) {
  var Borrow = sequelize.define('Borrow', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    BorrowDate: {
      type : DataTypes.DATE
    },
    renderingDate: {
      type : DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Borrow.belongsTo(models.Product);
        Borrow.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.BorrowDate = this.BorrowDate;
        result.renderingDate = this.renderingDate;
        if (this.Product) {
          result.product = this.Product.responsify();
        }
        if (this.User) {
          result.user = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Borrow;
};
