var sockjs = require('sockjs'),
	http = require('http');

var options = {
	sockjs_url : 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'
};

var sockjs_server = sockjs.createServer(options),
	http_server = http.createServer();

var users = {},
	count = 0;

sockjs_server.on('connection', function(conn){

	broadcast('client connected: ' + conn.id);
	users[conn.id] = conn;
	count++;
	console.log('users: ' + count);

	conn.on('data', function(message){
		var m = conn.id + ': ' + message;
		var except = {};
		except[conn.id] = true;
		broadcast(m, except);
	});

	conn.on('close', function(){
		delete users[conn.id];
		count--;
		broadcast(conn.id + ' has disconnected.');
		console.log('users: ' + count);
	});
});

sockjs_server.installHandlers(http_server, { prefix : '/jxchat'});
console.log('listening: 0.0.0.0:9999');
http_server.listen(9999, '0.0.0.0');

/**
*	broadcast message to all users, except nosend[user.id] = true
**/
function broadcast(message, nosend){
	nosend = nosend || {};
	for(id in users){
		if(!nosend[id]){
			var curr=users[id];
			curr.write(message);
		}
	};
}
