define(["text!/tpl/message.html"],function(html){
	function render(){
		$(".page-content").html(html);
	}
	return {
		render:render
	};
});
