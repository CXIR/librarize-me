'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    loanDate: {
      type : DataTypes.DATE
    },
    renderingDate: {
      type : DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Loan.belongsTo(models.Product);
        Loan.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.loanDate = this.loanDate;
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
  return Loan;
};
