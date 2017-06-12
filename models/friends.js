'use strict';
module.exports = function(sequelize, DataTypes) {
  var Friends = sequelize.define('Friends', {
    statutDemande: {
      type : DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Friends.belongsTo(models.User, {
            // User who ask
            foreignKey: 'idUser1'
        });
        Friends.belongsTo(models.User, {
            // User who receive ask
            foreignKey: 'idUser2'
        });
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.statutDemande = this.statutDemande;
        if (this.User) {
          result.user = this.User.responsify();
        }
        result.user = this.idUser1;
        result.friend = this.idUser2;
        return result;
      }
    }
  });
  return Friends;
};
