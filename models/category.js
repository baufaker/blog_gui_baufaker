var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({
	name: String
});

Category = mongoose.model('category', categorySchema);

Category.findAll = function(callback){
	Category.find({}, function(err, categories){
		if(err){
			callback(err);
		}else{
			callback(null, categories);
		}
	});
}

Category.saveCategory = function(name, callback){
	new Category({name: name}).save(function(err, post){
		if(err){
			callback(err);
		}else{
			callback();
		}
	});
}

Category.updateCategory = function (name, id, callback){
	Category.findById(id, function(err, category){
		if(err){
			callback(err);
		}else{
			category.name = name;
			category.__v += 1;
			category.save(callback(null, category));
		}
	});
}

Category.deleteCategory = function (cat_id, callback){
	Category.remove({_id: cat_id}, function(err, result){
		if(err){
			callback(err);
		}else{
			callback(null, result);
		}
	});
}

module.exports.Category = Category;