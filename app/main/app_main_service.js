

angular.module('main.service',['util.database']).
	service('mainMemoService', function(connFactory){

		this.updateNewMemoList = function(userEmail, newMemoList){	

			var objectStore = connFactory.getObjectStore("members", "readwrite");

			var index = objectStore.index("user_email_idx");

			var request = index.get(userEmail);

			request.onsuccess = function(){
				var matchingUser = request.result;

				if(matchingUser !== undefined){
					
					matchingUser.todo_list = newMemoList;

					var putRq = objectStore.put(matchingUser);

				}else{
					alert("Save Fail");
				};
			};

		};


		this.getMemoListByUserEmail = function(userEmail, callback){

			var objectStore = connFactory.getObjectStore("members", "readonly");

			var index = objectStore.index("user_email_idx");

			var request = index.get(userEmail);

			request.onsuccess = function(){
				var matchingUser = request.result;

				if(matchingUser !== undefined){

					callback(matchingUser.todo_list);

				}else{
					alert("Retrieve Fail");
				};
			};
		};

	});

angular.module('main.directive', []);

angular.module('main.filter', []);

angular.module('main',['main.service', 'main.directive', 'main.filter', 'showCurrentTime']).
	run(function(mainMemoService, db){

	});


