var db;

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;



$(document).ready(function(){

	initDB();

	$('#join_form').submit(function(){

		var checkPasswd = $('#input_pw', '#join_form').val();

		var confirmPasswd = $('#input_confirm_pw', '#join_form').val();

		if(checkPasswd !== confirmPasswd){
			alert('입력하신 비밀번호가 일치하지 않습니다.');	
			return false;
		};


		var user = {
			user_email : $('#input_id', '#join_form').val(),
			user_passwd : checkPasswd,
			user_nickname : $('#input_nickname', '#join_form').val(),
			join_dt : new Date().getTime(),
			modify_dt : null,
			todo_list : []
		};

		var tx = db.transaction(["members"], "readwrite");

		tx.oncomplete = function(event) {
	  		console.log("All done!");
		};

		tx.onerror = function(event){
			alert("transaction error");
		};

		var memberObjStore = tx.objectStore("members");

		var index = memberObjStore.index("user_email_idx");

		var request = index.get(user.user_email);

		request.onsuccess = function(){
			var matchingUser = request.result;

			if(!matchingUser){
				
				var rq = memberObjStore.add(user);

				rq.onsuccess = function(event){
					console.log("done with insert");
					alert("회원가입이 완료되었습니다.");

					$('#joinPage').modal('hide');
				};

			}else{

				alert("이미 가입된 email입니다.");
			};
		};

		return false;
		
	});

	$('#input_pw').change(function(){

		this.setCustomValidity(this.validity.patternMismatch ? '암호는 대소문자 포함해서 6자리 이상입력해야 합니다.' : '');

		if(this.checkValidity()){
			join_form.input_confirm_pw.pattern = this.value;
		}

	});

	$('#input_confirm_pw').change(function(){

		this.setCustomValidity(this.validity.patternMismatch ? '입력한 비밀번호와 동일하게 입력해주십시오.' : '');

	});

	$('#login_form').submit(function(){

		var input_id = $('#login_form #input_id').val();
		var input_pw = $('#login_form #input_pw').val();

		todoApp_login(input_id, input_pw);
	
		return false;

	});

});



function initDB(){

	var dbName = "todos";

	var version = 3;

	var request = indexedDB.open(dbName, version);

	request.onupgradeneeded = function(e) {

		console.log("running onupgradeneeded");
		var thisDb = e.target.result;
	 
 		//Create members IndexedDB
		if(!thisDb.objectStoreNames.contains("members")) {

			console.log("I need to make the members objectstore");
			var objectStore = thisDb.createObjectStore("members", { keyPath: "user_email", autoIncrement:true }); 
			objectStore.createIndex("user_email_idx", "user_email", { unique: true });
		};
 
	};

	request.onerror = function(e){
		console.log("Database error code");
	};

	request.onsuccess = function(e){
		db = request.result;
		
		db.onerror = function(event){
			alert("Database Error : " + event.target.errorCode);
		};

		check_memorized_passwd();
	};

};

function check_memorized_passwd(){

	var user_email = localStorage['user.user_email'];
	var user_passwd = localStorage['user.user_passwd'];

	if(user_email !== undefined && user_passwd !== undefined){
		todoApp_login(user_email, user_passwd);
	}else{
		show_login_form();
		hide_loading_img();
	};
};

function hide_login_form(){
	$('.container').css('display', 'none');
};

function show_login_form(){
	$('.container').css('display', '');
};


function hide_loading_img(){
	$('.loading').css('display','none');
	$('#wrap').css('display','block');  
};

function todoApp_login(input_id, input_pw){

	var tx = db.transaction(["members"], "readwrite");

	tx.oncomplete = function(event) {
 		console.log("All done!");
	};

	tx.onerror = function(event){
		alert("transaction error");
	};

	var memberObjStore = tx.objectStore("members");
	var index = memberObjStore.index("user_email_idx");

	var request = index.get(input_id);

	request.onsuccess = function(){
		var matchingUser = request.result;

		if(matchingUser !== undefined){

			var user_passwd = matchingUser.user_passwd;

			if(input_pw === user_passwd){

				if(shouldRememberUser()){
					remember_user(matchingUser);
				}

				input_user_to_sesseion(matchingUser);

				var url = "./../main/index.html";    
				move_page_into(url);

			}else{
				alert('비밀번호가 맞지 않습니다.');
			}

		}else{
			alert("로그인 정보가 맞지 않습니다.");
		}

		show_login_form();
		hide_loading_img();
	};

};

function input_user_to_sesseion(user){
	sessionStorage['user.user_email'] = user.user_email;
	sessionStorage['user.user_nickname'] = user.user_nickname;
};

function move_page_into(url){
	$(location).attr('href',url);
};

function shouldRememberUser(){

	var isChecked = $('#remember_me').is(":checked");

	if(isChecked){
		return true;
	}else{
		return false;
	}

};

function remember_user(user){

	if(supports_html5_storage()){

		localStorage['user.user_email'] = user.user_email; 
		localStorage['user.user_passwd'] = user.user_passwd;
		
	}else{
		//Use Cookie
	}

};

function supports_html5_storage() {
	try {
    	return 'localStorage' in window && window['localStorage'] !== null;
  	} catch (e) {
    	return false;
  	}
};


function getTodayAsYYYYMMDD()
 {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  

  return year + "." + month + "." + day;
 };


function validUserJoin(inputUserEmail){

	var memberObjStore = tx.objectStore("members");
	var index = memberObjStore.index("user_email_idx");

	var request = index.get(inputUserEmail);

	request.onsuccess = function(){
		var matchingUser = request.result;

		if(matchingUser){
			alert('!@#!@#!@#123');
		};
	};

};