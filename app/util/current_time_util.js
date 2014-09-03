angular.module('showCurrentTime', []).
			factory('time' , function($timeout){

				var time = {};

				(function tick(){
					var now = new Date();

					var year = now.getFullYear();
					var month = now.getMonth();
					var day = now.getDate();
					var hour = now.getHours();
					var minutes = now.getMinutes();
					var seconds = now.getSeconds();

					time.now = year + "." + month + "." + day + " " + hour + ":" + minutes + ":" + seconds;

					$timeout(tick, 1000);
				})();
				return time;
			});