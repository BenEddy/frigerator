var express        = require('express')
var routes         = require('./routes');
var app            = module.exports = express.createServer();
var io             = require('socket.io').listen(app);
var WordCollection = require('./models/word-mongo').WordCollection
var wordCollection = new WordCollection()
var wordImporter   = require('./models/word_importer').WordImporter

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
  if(req.xhr) {
    wordCollection.findAll(function(error, words){
      res.send(JSON.stringify(words))
    });
  } else {
    res.render("index.jade", { locals: {
        title: "'Frigerator"
      }
    });
  }
});

app.get('/import', function(req, res){
  importer = new wordImporter({collection: wordCollection});
  counter  = 0;
  importer.run(function(word){
    counter++;
  });

  res.render("import.jade", {locals:
    {title: "Import"}
  });
});

// Socket IO
io.sockets.on('connection', function (socket) {
  socket.on('word repositioned', function (params) {
    wordCollection.update(params);
    io.sockets.emit('word repositioned', params);
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});