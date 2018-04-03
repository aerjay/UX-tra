$(function() {
	var socket = io();
	socket.on('addProj', function(proj){
		console.log("get something from server");
		console.log(proj);
		var title = proj.proj;
		var desc = proj.des;
		var author = proj.auth;
		var wall = $('#brickwall');
		let brick = $('<div class="brick">')
		brick.css('max-height', (Math.floor(Math.random() * 120) + 300) + 'px');
		date = new Date();
		brick.append('<img src="' + proj.buff + '?'+ date.getTime() +'">');
		location.reload();
		let text = $('<div class="dash-text-wrapper">')
		text.append($('<h3>').html(title));
		text.append($('<p>').html(desc));
		brick.append(text);
		// Add the creator of the project
		brick.append($('<p class="brick-creator">').html('By ' + author));
		// Add brick to wall
		wall.append(brick);
	});

	$('<div class="brick">').css('max-height', (Math.floor(Math.random() * 120) + 300) + 'px');
});