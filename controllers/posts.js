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
				Category.findAll(function(err, categories){
					if(err){
						res.send('erro na hora de buscar as usas categorias');
					}else{
						res.render('posts/index', {
							posts: posts.sort({created:-1}),
							categorias: categories,
							moment: moment,
							category: Category
						});
					}
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
		req.param('categories'),
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
					});
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
					Category.findAll(function(err, categories){
						if(err){
							res.send('erro ao achar as categorias para inserir no seu post');
						}else{
							res.render('posts/view_edit_post', {
								title: 'Edit your post',
								post: post,
								categories: categories
							});
						}
					});
				}
			});
		}else{
			res.redirect('/');
		}
	});
	
	app.post('/post/my_posts/:id', function(req, res){
		Post.updatePost(req.param('title'),
		req.param('content'),
		req.param('categories'),
		req.params.id,
		function(err, post){
			if(err){
				res.send('Erro ao fazer update no seu post');
			}else{
				res.redirect('/post/my_posts');
			}
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
	
	app.get('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err){
				res.send('erro ao buscar o seu post');
			}else{
				res.render('posts/read_post', {post:post});
			}
		});
	});
	
	app.get('/about', function(req, res){
		res.render('posts/about');
	});
	
	app.get('/contact', function(req, res){
		res.render('posts/contact');
	});
	
	app.post('/contact', function(req, res){
		app.mailer.send('emails/contact_email', {
		    to: 'baufaker@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
		    subject: '[Blog] '+req.param('subject'), // REQUIRED.
		    content: req.param('content') // All additional properties are also passed to the template as local variables.
		  }, function (err) {
		    if (err) {
		      // handle error
		      console.log(err);
		      res.send('Erro ao tentar enviar o email');
		    }else{
		    	res.send('Email enviado!');
		    }
		  });
	});
	
}