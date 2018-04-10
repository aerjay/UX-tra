$(function() {
	var socket = io();
	var current = 'home';

	//needs to emit an event when the user clicks different pages
	//user clicks home, user clicks project, user clicks add project
	
	//desktop
	$("#addButton").hide();
	$("#content").hide();
	$(".wrapper").hide();

	$('#home').click(function(){
		if(!$('#home a').hasClass("activeMenu")){
			$('#project a').removeClass("activeMenu");
			$('#home a').addClass("activeMenu");
			$("#brickwall").show();
			$(".wrapper").hide();
			$("#addButton").hide();
			$("#content").hide();
		}
		socket.emit('gotoHome');
	});

	$('#project').click(function(){

		$('#home a').removeClass("activeMenu");
		$('#project a').addClass("activeMenu");
		$(".wrapper").show();
		$("#brickwall").hide();
		$("#addButton").show();
		$("#content").hide();
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

	$('#addButton').click(function(){
		$("#addButton").hide();
		$("#brickwall").hide();
		$(".wrapper").hide();
		$("#content").show();
	});

	socket.on('ldProjs', function(data){
		console.log(data.data.length);
		 if (data.data.length > 0) {
			for (let proj of data.data) {
				var title = proj.proj;
				var desc = proj.des;
				var author = proj.auth;
				var wall = $('#brickwall');
				let brick = $('<div class="brick">');
				brick.css('max-height', (Math.floor(Math.random() * 120) + 300) + 'px');
				proj.buff = JSON.parse(proj.buff);
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
		 }
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
		proj.buff = JSON.parse(proj.buff);
		brick.append('<img src="' + proj.buff +'">');
		let text = $('<div class="dash-text-wrapper">')
		text.append($('<h3>').html(title));
		text.append($('<p>').html(desc));
		brick.append(text);
		// Add the creator of the project
		brick.append($('<p class="brick-creator">').html('By ' + author));
		// Add brick to wall
		wall.append(brick);
	});
});