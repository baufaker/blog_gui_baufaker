var moment = require('moment');
var mongoose = require('mongoose');
var Post = require('../models/post').Post;
var Category = require('../models/category').Category;

moment.lang("pt");

module.exports.controller = function(app){
	
	//rota da home
	app.get('/', function(req, res){
		Post.findAll(function(err, posts){
			if(err){
				res.send('erro na hora de buscar os seus posts');
			}else{
				res.render('posts/index', {
					title: "Gui Baufaker",
					posts: posts,
					moment: moment
				});
			}
		});
	});
	
	app.get('/post/new', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Category.findAll(function(err, categories){
				if(err){
					res.send('erro ao achar as categorias para inserir no seu post');
				}else{
					console.log(categories);
					res.render('posts/new_post', {
						categories: categories
					});
				}
			});
		}else{
			res.redirect('/');
		}
	});
	
	app.post('/post/new', function(req, res){
		Post.savePost(req.param('title'),
		req.param('content'),
		req.session.admin_id,
		function(err){
			if(err){
				res.send('erro ao tentar salvar o seu post');
			}else{
				res.redirect('/post/my_posts');
			}
		});
	});
	
	app.get('/post/my_posts', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Post.findByAdmin(req.session.admin_id, function(err, posts){
				if(err){
					res.send('Erro ao tentar buscar os seus posts');
				}else{
					res.render('posts/my_posts',{
						posts: posts
					})
				}
			});
		}else{
			res.redirect('/');
		}
	});
	
	app.get('/post/my_posts/:id', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Post.findById(req.params.id, function(err, post){
				if(err){
					//o certo aqui é renderizar uma view com a mensagem abaixo
					res.send('Erro ao tentar achar o seu post');
				}else{
					res.render('posts/view_edit_post', {
						title: 'Edit your post',
						post: post
					});
				}
			});
		}else{
			res.render('users/not_authorized');
		}
	});
	
	app.post('/post/my_posts/:id', function(req, res){
		Post.updatePost(req.param('title'),
		req.param('content'),
		req.params.id,
		function(err, docs){
			res.redirect('/post/my_posts');
		});
	});
	
	app.get('/post/delete/:id', function(req, res){
		if(Admin.checkIfLogedIn(req, res)){
			Post.deletePost(req.params.id, function(err, result){
				if(err){
					//o certo aqui é renderizar uma view com a mensagem abaixo
					res.send('erro ao tentar deletar o seu post');
				}else{
					res.redirect('/post/my_posts');
				}
			});
		}else{
			res.redirect('/');
		}
	});
	
}