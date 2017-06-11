'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    lastname: {
      type : DataTypes.STRING
    },
    firstname: {
      type : DataTypes.STRING
    },
    birthdate: {
      type : DataTypes.DATE
    },
    mailAdress: {
      type : DataTypes.STRING
    },
    password: {
      type : DataTypes.STRING
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.lastname = this.lastname;
        result.firstname = this.firstname;
        result.birthdate = this.birthdate;
        result.mailAdress = this.mailAdress;
        result.password = this.password;
        if (this.Product) {
          result.product = this.Product.responsify();
        }
        return result;
      }
    }
  });
  return User;
};
