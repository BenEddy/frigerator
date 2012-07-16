$(window).load(function(){
  var socket = io.connect(window.location.href);

  $.ajax({
    url: "/",
    success: function(data) {
      parsed_data = JSON.parse(data)

      $(parsed_data).each(function(index, word){
        wordNode = $("<div class='word' id='" + word._id + "'>" + word.text + "</div>")
        wordNode.offset({top: word.y, left: word.x})
        $("#words").append(wordNode)
        wordNode.draggable({
          stop: function(event, ui) {
            socket.emit("word repositioned", {
              _id: $(this).attr("id"),
              x: $(this).offset().left,
              y: $(this).offset().top
            })
          }
        });
      });

      $("#mask").fadeOut()
    }
  });

  socket.on("word repositioned", function(word){
    $("#" + word._id).offset({
      top: word.y,
      left: word.x
    })
  });
});