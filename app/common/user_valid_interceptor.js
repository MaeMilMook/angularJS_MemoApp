function check_session(){
	var session = sessionStorage['user.user_email'];
	if(session === undefined){
		var url = "./../login/login.html";
		$(location).attr('href',url);
	}
};

check_session();