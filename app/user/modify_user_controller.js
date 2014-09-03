var ModifyUserController = function($scope, modifyUserService){

	$scope.sesseionUser = {
		userEmail : sessionStorage['user.user_email'],
		userNickName : sessionStorage['user.user_nickname']
	};

	$scope.submitModifyForm = function(curPasswd, newPassword, confirmPasswd){
		
		if(newPassword !== confirmPasswd){
			alert('새로운 비밀번호가 일치하지 않습니다.');
		}else{

			modifyUserService.updateUserInfo($scope.sesseionUser.userEmail, curPasswd, newPassword, confirmPasswd);

		};

	};


};
