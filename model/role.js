let DB = require('../config/database');

const Role = DB.model('Role', {
	  tableName: 'role',
	  idAttribute : 'id_role',
	  
  	users() {
	    return this.belongsToMany(require('./user'), 'user_role.user_id');
  	},

});

module.exports = Role;