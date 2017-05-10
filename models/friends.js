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
            foreignKey: 'idUser1' //celui qui fait la demande d'amis
        });
        Friends.belongsTo(models.User, {
            foreignKey: 'idUser2' // celui qui est demandé
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
        return result;
      }
    }
  });
  return Friends;
};
