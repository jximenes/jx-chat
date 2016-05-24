
(function(){
	"use strict";

	angular
		.module('chatModule')
		.directive('chat', ['mysocket',function(mysocket){
			var directive = {
				restrict: 'E',
                compile: compileFn,
				controller: controllerFn,
				template: '<div class="messages-container"><p ng-repeat="m in messages">{{m.text}}<p></div><input type="text" ng-model="currentMessage" ng-disabled="!connected" class="message"></input><span class="send-message" ng-disabled="!connected" ng-click="sendMessage()">send<span>'
			};

			function controllerFn($scope, $element, $attrs)
			{
				$scope.messages = [];
				$scope.currentMessage = "";
				$scope.connected = false;
				$scope.sendMessage = function(){
					if(!$scope.currentMessage){
						return;
					}
					mysocket.send($scope.currentMessage);
					$scope.messages.push({ text: $scope.currentMessage });
					$scope.currentMessage="";
				}
            }

			controllerFn.$inject = ['$scope', '$element', '$attrs'];

			function compileFn(iElement, iAttrs) {
				return {
					pre: function(scope, element, attrs) {
					},
					post: function(scope, element, attrs){
						mysocket.setHandler('open', function(){
							scope.messages.push({ text:'connected' });
							scope.connected=true;
						});

						mysocket.setHandler('close', function(){
							scope.connected = false;
							scope.messages.push({text: 'disconnected'});
						});

						mysocket.setHandler('message', function(message){
							scope.messages.push({ text: message.data });
						});

						scope.$watchCollection('messages', function(){
							var elem = element.children()[0];
							elem.scrollTop = elem.scrollHeight;
						});

						element.bind("keydown keypress", function(event) {
			                if(event.which === 13) {
			                    scope.sendMessage();
								scope.$apply();
			                    event.preventDefault();
			                }
			            });
					}
				};
			}

			return directive;
		}]);
})();
