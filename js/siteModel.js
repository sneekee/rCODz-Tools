
(function(){
	ko.applyBindings({ games: siteModel.games } , document.getElementById('navbarsExampleDefault'));
    ko.applyBindings({ credits: siteModel.credits }, document.getElementsByTagName('footer')[0]);
})()

function switchViewModel(dlc){
	$('#welcome').hide();
debugger;
	ko.cleanNode(document.getElementById("viewHeader"));
	ko.cleanNode(document.getElementById("viewContainer"));
	ko.applyBindings(dlc, document.getElementById("viewHeader"));

	$('#viewContainer').load(dlc.viewTemplate); //.html($('script[name="' + dlc.templateName + "'-template").html());
	$.getScript(dlc.viewModel, function(){
	   eval(dlc.initilizationFunction);
	 });
	
}
