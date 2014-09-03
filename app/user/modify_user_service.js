

angular.module('modifyUser.service',['util.database']).
	service('modifyUserService', function(connFactory){

		this.updateUserInfo = function(userEmail, userPasswd, newUserPasswd, confirmPasswd){	

			var objectStore = connFactory.getObjectStore("members", "readwrite");

			var index = objectStore.index("user_email_idx");

			var request = index.get(userEmail);

			request.onsuccess = function(){
				var matchingUser = request.result;

				if(matchingUser !== undefined){
					
					if(matchingUser.user_passwd === userPasswd){

						if(newUserPasswd === confirmPasswd){

							matchingUser.user_passwd = newUserPasswd;

							var putRq = objectStore.put(matchingUser);

							sessionStorage.clear();
							localStorage.clear();

							alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');

							$(location).attr('href',"./../login/login.html");

						}else{
							alert('새 비밀번호가 일치하지 않습니다.')
						}

					}else{
						alert('기존 비밀번호가 일치하지 않습니다.')
					}

				}else{
					alert("Save Fail");
				};
			};

		};

	});

angular.module('modifyUser.directive', []);

angular.module('modifyUser.filter', []);

angular.module('modifyUser',['modifyUser.service', 'modifyUser.directive', 'modifyUser.filter']).
	run(function(modifyUserService){

	});


