var Mongolian = require("mongolian")
var ObjectId =  require('mongolian').ObjectId

if(process.env.MONGOHQ_URL) {
  var db = new Mongolian(process.env.MONGOHQ_URL);
} else {
  var server = new Mongolian;
  var db = server.db("node-words")
}

var words = db.collection("words")

WordCollection = function() {

}

WordCollection.prototype.findAll = function(callback) {
  words.find().toArray(function (err, array) {
    for(i = 0; i < array.length; i++) {
      array[i]._id = array[i]._id.toString()
    }

    callback(err, array)
  })
}

WordCollection.prototype.update = function(params, callback) {
  words.update(
    {_id: new ObjectId(params._id)},
    { $set : { x : params.x , y : params.y } }
  );
}

WordCollection.prototype.removeAll = function() {
  words.remove({});
}

WordCollection.prototype.insert = function(word) {
  words.insert(word);
}

exports.WordCollection = WordCollection