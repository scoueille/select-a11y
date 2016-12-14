/*******************
  color swatch
********************/
$(document).ready(function(){
  //convert rgba color to hex color
  $.cssHooks.backgroundColor = {
      get: function(elem) {
          if (elem.currentStyle)
              var bg = elem.currentStyle["background-color"];
          else if (window.getComputedStyle)
              var bg = document.defaultView.getComputedStyle(elem,
                  null).getPropertyValue("background-color");
          if (bg.search("rgb") == -1)
              return bg;
          else {
              bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
              function hex(x) {
                  return ("0" + parseInt(x).toString(16)).slice(-2);
              }
              return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
          }
      }
  }
  //set hex value for each color swatch
  $('.sg-color-swatch').each(function(){
    var actual = $(this);
    $(this).append('<span class="sg-color-swatch-hex">'+actual.css("background-color")+'</span>');
  });

  $('.sg-color-swatch-lighten').each(function(){
    var actual = $(this);
    $(actual).append(actual.css("background-color"));
  });

  $('.sg-color-swatch-darken').each(function(){
    var actual = $(this);
    $(actual).append(actual.css("background-color"));
  });
});
