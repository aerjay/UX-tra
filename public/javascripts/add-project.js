
var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

// highlight drag area
$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});

// change inner text
$fileInput.on('change', function() {
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev('.js-set-number');

  if (filesCount === 1) {
    // if single file then show file name
    $textContainer.text($(this).val().split('\\').pop());
  } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
  }
});

$('.selectbox-option').mousedown(function(e) {
    e.preventDefault();
    $(this).prop('selected', !$(this).prop('selected'));
    return false;
});

document.getElementById('#output').innerHTML = location.search;
$(".selectbox").chosen();