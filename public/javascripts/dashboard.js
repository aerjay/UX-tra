$(function() {
	var socket = io();

	//needs to emit an event when the user clicks different pages
	//user clicks home, user clicks project, user clicks add project
	
	//desktop
	$('#home').click(function(){
		if(!$('#home').hasClass("activeMenu")){
			$('#home').addClass("activeMenu");
		}
		socket.emit('gotoHome');
	});

	$('#project').click(function(){
		$('#home').removeClass("activeMenu");
		$('#project').addClass("activeMenu");
		socket.emit('gotoProj');
	});

	//mobile
	$('#mhome').click(function(){
		if(!$('#mhome').hasClass("activeMenu")){
			$('#mhome').addClass("activeMenu");
		}
		socket.emit('gotoHome');
	});

	$('#mproject').click(function(){
		$('#mhome').removeClass("activeMenu");
		$('#mproject').addClass("activeMenu");
		socket.emit('gotoProj');
	});

	//both mobile and desktop
	$('#addButton').click(function(){
		socket.emit('gotoAddProj');
	});


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
		location.reload(); // might need to remove
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