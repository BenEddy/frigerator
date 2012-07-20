$(function(){
  var socket         = io.connect(window.location.href);
  var wordsContainer = $("#words");

  yPercent = window.innerHeight / 3000
  xPercent = window.innerWidth / 6000
  $("#legend span").height(100 * yPercent + "px")
  $("#legend span").width(200 * xPercent + "px")

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

  $(window).scroll(function(event){
    xPercent = window.scrollX / 6000
    yPercent = window.scrollY / 3000
    indicatorX = 200 * xPercent
    indicatorY = 100 * yPercent
    $("#legend span").css("top", indicatorY + "px").css("left", indicatorX + "px")
  });

  socket.on("word repositioned", function(word){
    $("#" + word._id).offset({
      top: word.y,
      left: word.x
    })

    pingY = (word.y / 3000) * 100
    pingX = (word.x / 6000) * 200
    ping = $("<span style=\"top: " + pingY + "px; left: " + pingX + "px;\" class=\"ping\">Ping</span>")
    $("#legend").append(ping)
  });
});