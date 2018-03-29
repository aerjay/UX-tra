$(document).ready(function(){
// Sample images
var images = ['1.jpg', '2.gif', '3.png', '4.jpg', '5.jpg', '6.jpg', '7.gif', '8.jpg',
			  '9.jpg', '10.jpeg', '11.jpeg', '12.jpg', '13.png', '14.png', '15.jpg'];

// Sample inputs
var title = "Cryptocurrency App";
var desc = "An application designed to keep track of a user's cryptocurrencies";
var author = 'Edrienne Manalastas';

var wall = $('#brickwall');
var limit = 32;
for (let i=0; i<limit; i++) {
	let brick = $('<div class="brick">')

	// Add the image
	brick.css('max-height', (Math.floor(Math.random() * 120) + 300) + 'px');
	brick.append('<img src="../images/' + images[Math.floor(Math.random() * 14)] + '">');
//	brick.append('<img src="<%=img%>' + images[Math.floor(Math.random() * 14)] + '">');

	// Add the text (title :: h3 & description :: p)
	let text = $('<div class="dash-text-wrapper">')
	text.append($('<h3>').html(title));
	text.append($('<p>').html(desc));
	brick.append(text);

	// Add the creator of the project
	brick.append($('<p class="brick-creator">').html('By ' + author));

	// Add brick to wall
	wall.append(brick);
}

});