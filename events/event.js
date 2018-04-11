var User = require("../models/User");

module.exports = function(io){ 
    io.on('connection', function(socket){
        console.log('login user: ', socket.request.user.username);
        
        // On init, load both dash and projs
        updateWho(socket);

        // Public Projects
        socket.on('ldPublic', function(){
            console.log('home event');
            projs = [];
            var query = {'pdata': { $exists: true}}; 
            User.find(query, null, {sort: '-pvote'}, function(err, docs){
                docs.forEach(function(entry){
                    projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username, vote: entry.pvote});
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
                    projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username, vote: entry.pvote});
                });
                console.log("updateUser");
                socket.emit('updateUser', {data: projs});
            });
        });

        // Increment the vote of a project
        socket.on('incVote', function(pname){
            var query = {'pname': pname}; 
            User.findOne(query, function(err, doc){
                if (err) { 	
                    return next(err); 
                }
                doc.pvote = doc.pvote + 1;
                doc.save();
            });
            //update everyone
            updateWho(io);
        });

        function updateWho(i){
            projs = [];
            var query = {'pdata': { $exists: true}}; 
            User.find(query, null, {sort: '-pvote'},function(err, docs){
                docs.forEach(function(entry){
                    projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username, vote: entry.pvote});
                });
                console.log(projs.length);
                i.emit('updateDash', {data: projs});
    
                proj = [];
                var query = {'username': socket.request.user.username, 'pdata': { $exists: true}}; 
                User.find(query, function(err, docs){
                    if (err) {  
                        return next(err); 
                    }
                    docs.forEach(function(entry){
                        proj.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username, vote: entry.pvote});
                    });
                    console.log("updateUser");
                    i.emit('updateUser', {data: proj});
                });
            });
        }
    });
};


