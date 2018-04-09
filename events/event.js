var User = require("../models/User");

module.exports = function(io){ 
    io.on('connection', function(socket){
        console.log('login user: ', socket.request.user.username);
        
        projs = [];
		var query = {'pdata': { $exists: true}}; 
		User.find(query, function(err, docs){
			docs.forEach(function(entry){
				projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
            });
            socket.emit('ldProjs', {data: projs});
        });

        socket.on('gotoHome', function(){
            console.log('home event');
            socket.emit('ldProjs', {data: projs});
        });

        socket.on('gotoProj', function(){
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
                console.log("ld projs");
                socket.emit('ldProjs', {data: projs});
            });
        });

        socket.on('gotoAddProj', function(){
            console.log('add proj event');
        });
    });
};
