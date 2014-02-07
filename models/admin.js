var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminSchema = new Schema({
	name: String,
	password: String
});

Admin = mongoose.model('admin', adminSchema);

Admin.auth_login = function(name, password, callback){
	
	//por enquanto, o usuário faz login se acharmos o nome dele no banco de dados
	var admin = Admin.findByName(name, function(err, admin_obj){
		if(err){
			callback(err);
		}else{
			if(admin_obj.password == password){
				callback(null, admin_obj);
			}else{
				err = 1;
				callback(err);
			}
		}
	});
}

Admin.saveAdmin = function(name, password, callback){
	new Admin({name:name, password: password}).save(callback);
}

Admin.findByName = function(name, callback){
	Admin.findOne({name: name}, function(err, admin_obj) { 
		if(err){
			callback(err);
		}else{
			if(admin_obj==null){
				err = 1;
				callback(err);
			}else{
				callback(null, admin_obj);
			}
		}
	});
}

Admin.checkIfLogedIn = function(req, res){
	if(req.session.admin_id){
		return true;
	}else{
		return false;
	}
}

module.exports.Admin = Admin;