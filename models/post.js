var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
	title: String,
	content: String,
	category: [{type: Schema.Types.ObjectId, ref: 'category'}],
	created: { type: Date, default: Date.now },
	admin: {type: Schema.Types.ObjectId, ref: 'admin'}
});

Post = mongoose.model('post', postSchema);

//funções de CRUD

Post.savePost = function (title, content, admin_id, callback){
	content = content.replace(/\r?\n/g, '<br />');
	new Post({title:title, content: content, admin:admin_id}).save(function(err, post){
		if(err){
			callback(err);
		}else{
		    callback();
		}
	});
}

Post.updatePost = function (title, content, id, callback){
	content = content.replace(/\r?\n/g, '<br />');
	Post.findById(id, function(err, post){
		if(err){
			callback(err);
		}else{
			post.content = content;
			post.title = title;
			post.__v += 1;
			post.save(callback(null, post));
		}
	});
}

Post.deletePost = function (post_id, callback){
	Post.remove({_id: post_id}, function(err, result){
		if(err){
			callback(err);
		}else{
			callback(null, result);
		}
	});
}


// funções de busca

Post.findAll = function(callback){
	Post.find({}, function(err, posts){
		if(err){
			callback(err);
		}else{
			callback(null, posts);
		}
	});
}

Post.findByAdmin = function (admin_id, callback){
	Post.find({admin: admin_id}, function(err, posts){
		if(err){
			callback(err);
		}else{
			callback(null, posts);
		}
	});
}


module.exports.Post = Post;