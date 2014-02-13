var activityTimeout = setTimeout(inActive, 2000);

$(document).ready(function() {
	xhr_get({});
});

function showPanel(data){
	$.each( data.sinks, function(key, value){
		composition='<div id="s'+value.id+'" class="sortable">';
		composition+='<span><input type="checkbox"';
		if(value.mute === "yes"){ 
			composition+=" checked ";
		}
		composition+='/>';
		composition+='<input type="text" value="'+value.volume+'" disabled /> ';
		composition+=value.description + "</span>";
		composition+='<input type="range" min="0" max="153" step="1" value="'+value.volume+'"';
		if(value.mute === "yes"){ 
			composition+=" disabled ";
		}
		composition+=' />';
		composition+="</div>";
		$("#sinks").append(composition);
	});

	$.each( data.inputs, function(key, value){
		composition='<div id="i'+value.id+'" class="inputsink">';
		composition+='<span><input type="checkbox"';
		if(value.mute === "yes"){ 
			composition+=" checked ";
		}
		composition+='/>';
		composition+='<input type="text" value="'+value.volume+'" disabled /> ';
		composition+=value.name + "</span>"; //+"->"+ data.sinks[value.sink].description;
		composition+='<input type="range" min="0" max="153" step="1" value="'+value.volume+'"';
		if(value.mute === "yes"){ 
			composition+=" disabled ";
		}
		composition+=' />';
		composition+="</div>";
		$("#s"+value.sink).append(composition);
		
		
		$(".sortable").sortable({
			items: "> div",
			connectWith: ".sortable",
			receive: function( event, ui ) {
				console.log("[" + this.id + "] received [" + ui.item.attr("id") + "] from [" + ui.sender.attr("id") + "]");
				xhr_get({id: ui.item.attr("id"), sink: this.id});
			},
			start: function() {
				clearTimeout(activityTimeout);
			},
			stop: function() {
				resetActive();
			}
		});
		//.disableSelection();
		

	});

	$('input[type="range"]').on("change",function(){
       xhr_get({id: this.parentNode.id, volume: this.value});
    });
    $('input[type="range"]').on('touchstart mousedown', function(){
		clearTimeout(activityTimeout);
	});
	$('input[type="range"]').on('touchend mouseup', function(){
		resetActive();
	});
	$('input[type="checkbox"]').on("change",function(){
	   if(this.checked){
		   value = 1;
		}else{
			value = 0;
		}
       xhr_get({id: this.parentNode.id, mute: value});
    });	

}

function resetActive(){
    $(document.body).attr('class', 'active');
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(inActive, 2000);
}

// No activity do something.
function inActive(){
   $(document.body).attr('class', 'inactive');
   xhr_get({});
   resetActive();
}

function xhr_get(parameters){
	$.ajax({
		type: "POST",
		url: "pactl.php",
		dataType: "json",
		data: parameters
	}).done(function( resp ) {
		console.log( resp );
		$('#inputs div').remove();
		$('#sinks div').remove();
		showPanel(resp);
	});
}
