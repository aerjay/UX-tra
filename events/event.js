var User = require("../models/User");

module.exports = function(io){ 
    io.on('connection', function(socket){
        console.log('login user: ', socket.request.user.username);
        
        // On init, load both dash and projs
        projs = [];
		var query = {'pdata': { $exists: true}}; 
		User.find(query, function(err, docs){
			docs.forEach(function(entry){
				projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
            });
            socket.emit('updateDash', {data: projs});
        });

        projs = [];
        var query = {'username': socket.request.user.username, 'pdata': { $exists: true}}; 
        User.find(query, function(err, docs){
            if (err) {  
                return next(err); 
            }
            docs.forEach(function(entry){
                projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
            });
            console.log("updateUser");
            socket.emit('updateUser', {data: projs});
        });

        // Public Projects
        socket.on('ldPublic', function(){
            console.log('home event');
            projs = [];
            var query = {'pdata': { $exists: true}}; 
            User.find(query, function(err, docs){
                docs.forEach(function(entry){
                    projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
                });
                console.log("updateDash");
                socket.emit('updateDash', {data: projs});
            });
        });

        // User Projects
        socket.on('ldPrivate', function(){
            console.log('proj event');
            //get all of the projects and send it to the client
            projs = [];
            var query = {'username': socket.request.user.username, 'pdata': { $exists: true}}; 
            User.find(query, function(err, docs){
                if (err) { 	
                    return next(err); 
                }
                docs.forEach(function(entry){
                    projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
                });
                console.log("updateUser");
                socket.emit('updateUser', {data: projs});
            });
        });
    });
};


