var mongoose = require('mongoose');
var Category = require('../models/category').Category;

module.exports.controller = function(app){
	
	app.get('/category/new', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			res.render('categories/new_category');
		}else{
			res.redirect('/');
		}
	});
	
	app.post('/category/new', function(req, res){
		Category.saveCategory(req.param('name'),
		function(err){
			if(err){
				res.send('erro ao tentar salvar a seu categoria');
			}else{
				res.redirect('/category/my_categories');
			}
		});
	});
	
	app.get('/category/my_categories', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Category.findAll(function(err, categories){
				if(err){
					res.send('Erro ao tentar buscar as suas categorias');
				}else{
					res.render('categories/my_categories',{
						categories: categories
					})
				}
			});
		}else{
			res.redirect('/');
		}
	});
	
	app.get('/category/my_categories/:id', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Category.findById(req.params.id, function(err, category){
				if(err){
					//o certo aqui é renderizar uma view com a mensagem abaixo
					res.send('Erro ao tentar achar o seu category');
				}else{
					res.render('categories/view_edit_category', {
						title: 'Edit your category',
						category: category
					});
				}
			});
		}else{
			res.render('users/not_authorized');
		}
	});
	
	app.post('/category/my_categories/:id', function(req, res){
		Category.updateCategory(req.param('name'),
		req.params.id,
		function(err, docs){
			res.redirect('/category/my_categories');
		});
	});
	
	app.get('/category/delete/:id', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Category.deleteCategory(req.params.id, function(err, result){
				if(err){
					//o certo aqui é renderizar uma view com a mensagem abaixo
					res.send('erro ao tentar deletar a sua categoria');
				}else{
					res.redirect('/category/my_categories');
				}
			});
		}else{
			res.redirect('/');
		}
	});
	
}