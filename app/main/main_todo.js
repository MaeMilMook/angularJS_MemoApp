5ar db;

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;


var login_user = {
	user_email : sessionStorage['user.user_email'],
	user_nickname : sessionStorage['user.user_nickname'],
	todo_list : JSON.parse(sessionStorage['user.todo_list'])
};


$(document).ready(function(){
	initDB();

	$('#addButtonGrp').hide();

	$('#input_memo').focus(function(){
		$('#addButtonGrp').show();
	});

	$('button[name="cancel"]', 'div[id*="ButtonGrp"]').click(function(){

		
		$('#addButtonGrp').hide();
		$('#input_memo').val('');		
	});

});

function todoCntl($scope){

	$scope.name = login_user.user_nickname;

	$scope.todoList = login_user.todo_list;

	$scope.addNewTodo = function(newTitle){
		
		if(isBlankValue(newTitle)){
			return false;
		};

		$scope.todoList.push({text:newTitle, importance:false, inpt_dtm : new Date().getTime()});
    
    	$scope.new_memo = '';

    	putNewListToDB(login_user.user_email, $scope.todoList);


	};

	$scope.archive = function(){
		var oldTodoList = $scope.todoList;
		$scope.todoList = [];

		angular.forEach(oldTodoList, function(todo){
			
			if(!todo.done){
				
				$scope.todoList.push(todo);
			}
		});

		updateListToDB(login_user.user_email, $scope.todoList);
	};


	$scope.makeFavoriteMemo = function(index){
		
		$scope.todoList[index].importance = !$scope.todoList[index].importance;

		updateListToDB(login_user.user_email, $scope.todoList);
	};

	$scope.deleteMemo = function(index){

		if(!confirm('삭제하시겠습니까?')){
			return false;
		}

		var oldTodoList = $scope.todoList;

		$scope.todoList = [];

		angular.forEach(oldTodoList, function(todo, i){
			
			if(index !== i){
				
				$scope.todoList.push(todo);
			}
		});

		updateListToDB(login_user.user_email, $scope.todoList);

	};


	$scope.toggleModifyMemoForm = function(index){
		toggleTodoForm(index);
	};

	$scope.modifyMemo = function(index, modi_memo){
		
		if(!confirm('수정하시겠습니까?')){
			return false;
		};

		$scope.todoList[index].text = modi_memo;

		updateListToDB(login_user.user_email, $scope.todoList);

		toggleTodoForm(index);
	};

}

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

function initDB(){

	var dbName = "todos";

	var version = 3;

	var request = indexedDB.open(dbName, version);

	request.onerror = function(e){
		console.log("Database error code");
	};

	request.onsuccess = function(e){
		db = request.result;
		
		db.onerror = function(event){
			alert("Database Error : " + event.target.errorCode);
		};
	};
};


function putNewListToDB(user_email, newTodoList){

	var objectStore = getObjectStore("members", "readwrite");
	var index = objectStore.index("user_email_idx");

	var request = index.get(user_email);

	request.onsuccess = function(){
		var matchingUser = request.result;

		if(matchingUser !== undefined){
			
			matchingUser.todo_list = newTodoList;

			var putRq = objectStore.put(matchingUser);

			sessionStorage['user.todo_list'] = JSON.stringify(matchingUser.todo_list);

		}else{
			alert("Save Fail");
		};
	};

};

function updateListToDB(user_email, newTodoList){

	var objectStore = getObjectStore("members", "readwrite");
	var index = objectStore.index("user_email_idx");

	var request = index.get(user_email);	

	request.onsuccess = function(){
		var matchingUser = request.result;

		if(matchingUser !== undefined){

			matchingUser.todo_list = newTodoList;

			var putRq = objectStore.put(matchingUser);

			sessionStorage['user.todo_list'] = JSON.stringify(matchingUser.todo_list);
			
		}else{
			alert("Save Fail");
		};
	};

};

function getObjectStore(storeName, option){
	var tx = db.transaction([storeName], option);

	tx.oncomplete = function(event) {
		console.log("All done!");
	};

	tx.onerror = function(event){
		alert("transaction error");
	};

	var memberObjStore = tx.objectStore(storeName);

	return memberObjStore;
};

