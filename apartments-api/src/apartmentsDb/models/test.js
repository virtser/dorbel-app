'use strict';
module.exports = function(sequelize, DataTypes) {
  var Test = sequelize.define('Test', {
    foo: DataTypes.STRING,
    bar: DataTypes.STRING
  });
  return Test;
};