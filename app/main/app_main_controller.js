
var MyMemoListController = function($scope, mainMemoService, time){

	$scope.sesseionUser = {
		userEmail : sessionStorage['user.user_email'],
		userNickName : sessionStorage['user.user_nickname']
	};

	//$scope.userMemoList = [];

	$scope.isSearchingFavoriteMemo = false;

	$scope.isSearchingMemo = false;

	$scope.time = time;

	$scope.addNewTodo = function(newMemo){
		
		if(isBlankValue(newMemo)){
			return false;
		};

		$scope.userMemoList.push({text:newMemo, importance:false, inpt_dtm : new Date().getTime()});
    
    	$scope.inputMemo = '';

    	mainMemoService.updateNewMemoList($scope.sesseionUser.userEmail, $scope.userMemoList);
	};

	$scope.findFavoriveMemo = function(){

		var isSearchingFavoriteMemo = !$scope.isSearchingFavoriteMemo;

		var oldUserMemoList = $scope.userMemoList;

		$scope.userMemoList = [];

		if(isSearchingFavoriteMemo){

			$scope.isSearchingMemo = true;

			angular.forEach(oldUserMemoList, function(memo, i){
			
				if(memo.importance === isSearchingFavoriteMemo){
					$scope.userMemoList.push(memo);
				}	
			});

		}else{

			$scope.isSearchingMemo = false;
			
			$scope.retrieveMemoList();
		}

		$scope.isSearchingFavoriteMemo = isSearchingFavoriteMemo;
	};

	$scope.retrieveMemoList = function(){

	  	mainMemoService.getMemoListByUserEmail($scope.sesseionUser.userEmail, 
	  		function(list){
	  			/* $apply() 모델 변경 감지 함수 */
	  			/*
					AngularJs는 모든 이벤트(ex. ng-click, $http 등)를 $scope.$apply()라 감
					싸고 있다. 따라서 $apply() 안에 $apply()를 호출하는 것은 에러를 발생한다.
	  			*/
	  			$scope.$apply(function(){
	  				$scope.userMemoList = list;
	  			});
	  		}
		);
	};	

	$scope.modifyMemoList = function(index, modifiedMemo){

		if(!confirm('수정하시겠습니까?')){
			return false;
		}

		var i = $scope.userMemoList.length - index - 1;

		$scope.userMemoList[i].text = modifiedMemo;

		mainMemoService.updateNewMemoList($scope.sesseionUser.userEmail, $scope.userMemoList);

		toggleTodoForm(index);

	};

	$scope.toggleModifyMemoForm = function(index){
		toggleTodoForm(index);
	};

	$scope.deleteMemoFromMemoList = function(index){

		if(!confirm('삭제하시겠습니까?')){
			return false;
		}

		index = $scope.userMemoList.length - index - 1;

		var oldUserMemoList = $scope.userMemoList;

		$scope.userMemoList = [];

		angular.forEach(oldUserMemoList, function(memo, i){
			
			if(index !== i){
				
				$scope.userMemoList.push(memo);
			}
		});

		mainMemoService.updateNewMemoList($scope.sesseionUser.userEmail, $scope.userMemoList);
	};

	$scope.makeFavoriteMemo = function(index){
		
		var i = $scope.userMemoList.length - index - 1;

		$scope.userMemoList[i].importance = !$scope.userMemoList[i].importance;

		mainMemoService.updateNewMemoList($scope.sesseionUser.userEmail, $scope.userMemoList);
	};

	$scope.setBackMemoList = function(){
		$scope.isSearchingFavoriteMemo = false;
		$scope.isSearchingMemo = false;
		$scope.retrieveMemoList();
	};


	$scope.changeSearchMode = function(length){

		if(length === 0){
			$scope.isSearchingMemo = false;
		}else{
			$scope.isSearchingMemo = true;
		}
	};

	$scope.logOutUser = function(){

		if(!confirm('로그아웃 하시겠습니까?')){
			return false;
		}

		clearStorage();

		$(location).attr('href',"./../login/login.html");
	};

	
};

function clearStorage(){
	sessionStorage.clear();
	localStorage.clear();
};


function toggleTodoForm(index){
	$('#retrieveTodo_'+index).toggle();
	$('#modifyToDo_'+index).toggle();
};

function isBlankValue(val){
	if(val === null || val === "" || val === undefined){
		return true;
	}else{
		return false;
	};

};


/*

$injdect 사용

var myModule = angular.module('myModule', []);

myModule.factory('varA', function(){
	return 10;
}).factory('varB', function(){
	return 5;
})

function doSomething(varA, varB){

	alert(varA + varB);
}

var $injector = angular.injector(['myModule']);

var var_a = $injector.get('varA');
var var_b = $injector.get('varB');

$injector.invoke(doSomething);*/