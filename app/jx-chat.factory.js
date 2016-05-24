
(function(){
	"use strict";

	angular
		.module('chatModule')
		.factory('mysocket', function (socketFactory) {
			var sockjs = new SockJS('http://127.0.0.1:9999/jxchat');

			var mySocket = socketFactory({
				socket: sockjs
			});

			return mySocket;
		});
})();
