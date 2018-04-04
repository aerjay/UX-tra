module.exports = function(io){ 
    io.on('connection', function(socket){
        console.log(':::socketio::: user: ', socket.request.user.username);

        socket.on('gotoHome', function(){
            console.log('home event');
        });

        socket.on('gotoProj', function(){
            console.log('proj event');
        });

        socket.on('gotoAddProj', function(){
            console.log('add proj event');
        });
    });
};
