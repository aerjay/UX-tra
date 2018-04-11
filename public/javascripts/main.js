$(function() {
	var socket = io();
	var active = 'home';

	// Init
	$('.wrapper').hide();
	$('#addButton').hide();
	$('#content').hide();

	setTimeout(function() {
		$('#splash').hide();
	}, 2450);

	// Home button
	$('#home, #mhome').click(function() {
		if (active != 'home') {
			active = 'home';

			$('#home a').addClass("activeMenu");
			$('#project a').removeClass("activeMenu");
			$('#mhome').addClass('activeMenu');
			$('#mproject').removeClass('activeMenu');

			$("#brickwall").show();

			$(".wrapper").hide();
			$("#addButton").hide();
			$("#content").hide();
		}
	});

	// Project button
	$('#project, #mproject').click(function() {
		if (active != 'project') {
			active = 'project';

			$('#project a').addClass("activeMenu");
			$('#home a').removeClass("activeMenu");
			$('#mproject').addClass('activeMenu');
			$('#mhome').removeClass('activeMenu');

			$(".wrapper").show();
			$("#addButton").show();

			$("#brickwall").hide();
			$("#content").hide();
		}
	});

	// Add project
	$('#addButton').click(function(){
		active = 'form';

		$("#content").show();

		$("#brickwall").hide();
		$(".wrapper").hide();
		$("#addButton").hide();
	});

	// Cancel Button
	$('#cancelButton').click(function() {
		active = 'project';

		$(".wrapper").show();
		$("#addButton").show();

		$("#brickwall").hide();
		$("#content").hide();
	});

	//must add a add vote button
	//where it will emit 'incVote' (which takes the project name as an arg) to the server to increment the vote 

	// Update dashboard with projects
	socket.on('updateDash', function(data){
		console.log(data.data.length);
		 if (data.data.length > 0) {
			 $('#brickwall').empty();
			for (let proj of data.data) {
				updateView('#brickwall', proj);
			}
		 }
	});

	// Update user with projects
	socket.on('updateUser', function(data) {
		console.log(data.data.length);
		if (data.data.length > 0) {
			$('.wrapper').empty();
			for (let proj of data.data) {
				updateView('.wrapper', proj);
			}
		}
	});

	socket.on('addProj', function(proj) {
		updateView('#brickwall', proj);
		socket.emit('ldPrivate');
	});

	// Add a proj to a view
	function updateView(view, proj) {
		var title = proj.proj;
		var desc = proj.des;
		var author = proj.auth;
		var wall = $(view);

		// Create the brick
		let brick = $('<div class="brick">');

		// If dashboard
		if (view == '#brickwall') {
			brick.css('max-height', (Math.floor(Math.random() * 120) + 300) + 'px');
		}
		
		brick.append('<img src="' + proj.buff +'">');
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