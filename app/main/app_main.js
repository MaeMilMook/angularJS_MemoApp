$(document).ready(function(){

	$('#newItemFormDiv').focusout(function(){

		//저장이 버튼이 사라짐.
		/*$('#addButtonGrp').hide();
		$('#input_memo').val('');*/
	});

	$('#input_memo').focus(function(){
		$('#addButtonGrp').show();
	});

	$('a[name="cancel"]', 'div[id*="ButtonGrp"]').click(function(){
		$('#addButtonGrp').hide();
		$('#input_memo').val('');		
	});

	/*$('#input_memo', 'form').mouseenter(function(){
		$(this).attr('placeholder', '여기에 새 메모를 입력하세요');
	});

	$('#input_memo', 'form').mouseleave(function(){
		$(this).attr('placeholder', '');
	});*/

	
	var maxLength = 3000;

	$('#mainRestTextLength').text(maxLength);

	$('#input_memo').keyup(function(){

		showRestTextLength(maxLength ,$(this));

	}).keydown(function(){

		showRestTextLength(maxLength ,$(this));

	});


	$('#showMemoList').click(function(){

		var $this = $(this);

		var isUpClass = $this.hasClass('icon-arrow-up');

		$('#mainMemoList').toggle();

		if(isUpClass){
			$this
			.removeClass('icon-arrow-up')
			.addClass('icon-arrow-down');
		}else{
			$this
			.removeClass('icon-arrow-down')
			.addClass('icon-arrow-up');
		}

		
	});

});


function showRestTextLength(maxLength , textContent){
	var text = textContent.val();

	if(text.length > maxLength){

		var subText = text.substring(0, maxLength);

		textContent.val(subText);

	}else{
		setLengthOfText(maxLength, text);
	}
}


function setLengthOfText(maxLength, inputText){
	var restTextLength = maxLength - inputText.length;

	$('#mainRestTextLength').text(restTextLength);

};