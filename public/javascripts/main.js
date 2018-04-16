$(function() {
	var socket = io();
	var active = 'home';

	// Init
	$('.wrapper').hide();
	$('#tabloid').hide();
	$('#addButton').hide();
	$('#content').hide();
	$('#tabloid').hide();

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
			$('#tabloid').hide();
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
			$('#tabloid').hide();
		}
	});

	// Add project
	$('#addButton').click(function(){
		active = 'form';

		$("#content").show();

		$("#brickwall").hide();
		$(".wrapper").hide();
		$("#addButton").hide();
		$('#tabloid').hide();
	});

	// Cancel Button
	$('#cancelButton').click(function() {
		active = 'project';

		$(".wrapper").show();
		$("#addButton").show();

		$("#brickwall").hide();
		$("#content").hide();
		$('#tabloid').hide();
	});
	
	// Click any project ??
	$('#brickwall, .wrapper').on('click', '.brick', function(event) {

		// Gets the project name of the clicked brick and sends it to server to get proj items
		socket.emit('getProj', $(this).children('.dash-text-wrapper').children('h3').text());

		$('#splash').show();
		setTimeout(function() {
			$('#splash').hide();
		}, 600);

		$('#tabloid').show();

		$('#brickwall').hide();
		$('.wrapper').hide();
		$('#content').hide();
		$('#addButton').hide();
	});

	$('#corner-btn').click(function() {
		if (active == 'project') {
			$('.wrapper').show();
			$('#brickwall').hide();
		} else {
			$('#brickwall').show();
			$('.wrapper').hide();
		}

		$("#addButton").hide();
		$("#content").hide();
		$('#tabloid').hide();
	});

	//On clicking the like update the db
	$( "#like" ).click(function(){
		var pname = $(".project-name").text();
		socket.emit("incVote",pname);
		$('#like-sum').text((parseInt($('#like-sum').text().split(" ")[0]) + 1) + " others like this project!");
	});

	// Updates project data in the project view
	socket.on('makeTabloid', function(proj) {
		console.log(proj);
		$('#proj-creator').text(proj.auth);
		$('#tabloid img').attr('src', proj.buff);
		$('#tabloid .project-desc').text(proj.des);
		$('#tabloid .project-name').text(proj.proj);
		$('#like-sum').text(proj.vote + " others like this project!");
	});
	
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
