var mongoose = require('mongoose');
var Admin = require('../models/admin').Admin;

module.exports.controller = function(app){
	
	//rota da página de login
	app.get('/guibaufaker', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			res.redirect('/dashboard');
		}else{
			res.render('admins/login');
		}
	});
	
	app.post('/guibaufaker', function(req, res){
		Admin.auth_login(req.param('name'), req.param('password'), function(err, admin){
			if(err){
				//Chamar página de usuário ou senha estão inválidos
				res.send('entrar no sistema com esse login e essa senha');
			}else{
				req.session.admin_id = admin.id;
				req.session.admin_name = admin.name;
				res.redirect('/dashboard');
			}
		});
	});
	
	app.get('/guibaufaker/signup', function(req, res){
		res.render('admins/signup');
	});
	
	app.post('/guibaufaker/signup', function(req, res){
		Admin.saveAdmin(req.param('name'),
		req.param('password'),
		function(err, docs){
			res.redirect('/');
		});
	});
	
	app.get('/dashboard', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			res.render('admins/dashboard',{
				admin: req.session.admin_name
			});
		}else{
			res.redirect('/');
		}
	});
	
	app.get('/logout', function(req, res){
		req.session.destroy();
		res.redirect('/');
	});
	
}