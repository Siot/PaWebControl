var activityTimeout = setTimeout(inActive, 2000);

$(document).ready(function() {
	xhr_get({});
});

function showPanel(data){
	$.each( data.sinks, function(key, value){
		composition='<div id="d'+value.id+'">';
		composition+='<input type="text" value="'+value.volume+'" disabled />';
		composition+=value.description;
		composition+='<input id="s'+value.id+'" type="range" min="0" max="153" step="1" value="'+value.volume+'" />'
		composition+="</div>";
		$("#sinks").append(composition);
	});

	$.each( data.inputs, function(key, value){
		composition='<div class="inputsink">';
		composition+='<input type="text" value="'+value.volume+'" disabled />';
		composition+=value.name+"->"+ data.sinks[value.sink].description;
		composition+='<input id="i'+value.id+'" type="range" min="0" max="153" step="1" value="'+value.volume+'" />'
		composition+="</div>";
		$("#d"+value.sink).append(composition);
	});
	
	$('input[type="range"]').on("change",function(){
       xhr_get({id: this.id, volume: this.value});
    });
    
    $('input[type="range"]').on('touchstart mousedown', function(){
		clearTimeout(activityTimeout);
	});
	$('input[type="range"]').on('touchend mouseup', function(){
		resetActive();
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
