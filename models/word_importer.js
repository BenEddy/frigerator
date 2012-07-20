var fs = require('fs');
var dictionaries = [
  {iterations: 8, file: "common.txt"},
  {iterations: 40, file: "suffixes.txt"},
  {iterations: 1, file: "basic.txt"},
  {iterations: 2, file: "foraker.txt"},
  {iterations: 1, file: "random.txt"},
  {iterations: 1, file: "urban.txt"},
  {iterations: 3, file: "programming.txt"},
  {iterations: 1, file: "last_minute.txt"}
]

WordImporter = function (options) {
  this.collection = options.collection;
}

WordImporter.prototype.__bind = function(fn, self) {
  return function() { return fn.apply(self, arguments) }
}

WordImporter.prototype.run = function(callback) {
  this.collection.removeAll();

  for (var i = 0; i < dictionaries.length; i++) {
    dictionary = dictionaries[i]
    for(counter = 0; counter < dictionary.iterations; counter++) {
      this.importDictionary(dictionary.file, callback);
    }
  }
}

WordImporter.prototype.importDictionary = function(file, callback) {
  fs.readFile(process.cwd() + "/dictionaries/" + file, this.__bind(function(err, data) {
    if (err) throw err;
    this.importDictionaryData(data, callback)
  }, this));
}

WordImporter.prototype.importDictionaryData = function(data, callback) {
  var array = data.toString().split("\n");
  for(i in array) {
    this.importWord({
      word: array[i],
      collection: this.collection,
      callback: callback
    });
  }
}

WordImporter.prototype.importWord = function(options) {
  options.collection.insert({
    text: options.word.replace(/\s/g, "&nbsp;").replace(/-/g, "&ndash;"),
    x: this.randomInt(5900),
    y: this.randomInt(2900)
  });
  options.callback(options.word);
}

WordImporter.prototype.randomInt = function (max) {
  return Math.floor(Math.random() * (max - 0 + 1)) + 0
}

exports.WordImporter = WordImporter