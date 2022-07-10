///// v1 /////
/*$(document).ready(function () {
  console.log("sup");
  let i = 0;
  $(".aNewMessApears").children().hide();
  $(`#${i}`).slideDown();  
$.fn.change = function () {
    console.log('inside 1: ' + i)
    $(`#${i}`).slideUp();
    i++;
    $(`#${i}`).slideDown();
    console.log('inside 2: ' + i)
}
console.log('outside 1: ' + i)
    $(`#${i}`).click(function () {
        console.log('before 1: ' + i)
      $.fn.change();
      console.log('after 1: ' + i)
    });
});*/
///// v2 /////

$(document).ready(function () {

  let i = 0;
  $.fn.change = function () {
    $(`#${i}`).slideUp();
    i++;
    i >= $(".aNewMessApears").children().length ? (i = 0) : i;
    $(`#${i}`).delay(500).slideDown();
  };
  $('#0').slideDown();

  $(".aNewMessApears")
    .children()
    .each(function () {
      $(this).click(function () {
        $.fn.change();
      });
    });
});
