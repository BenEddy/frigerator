$(function(){
  var socket         = io.connect(window.location.href);
  var wordsContainer = $("#words");

  $.ajax({
    url: "/",
    success: function(data) {
      parsed_data = JSON.parse(data)
      html        = [];

      for(i = 0; i < parsed_data.length; i++) {
        word = parsed_data[i]
        html[i] = "<div style='top: " + word.y + "px; left: " +
          word.x + "px;' class='word' id='" + word._id +
          "'>" + word.text + "</div>"
      }
      $("#words").append($("#magnets").html())
      $("#words").append(html.join(""))

      $(".word").hover(function(event){
        $(this).draggable({
          stop: function(event, ui) {
            socket.emit("word repositioned", {
              _id: $(this).attr("id"),
              x: $(this).offset().left,
              y: $(this).offset().top
            })
          }
        });
      });
    }
  });

  socket.on("word repositioned", function(word){
    $("#" + word._id).offset({
      top: word.y,
      left: word.x
    })
  });
});