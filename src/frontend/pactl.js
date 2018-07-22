var socket = io();

var userActivity = false;

socket.on('data update', function(msg){
    console.log('data update', msg)
  if(!userActivity) {
    $('#inputs div').remove();
    $('#sinks div').remove();
    showPanel(msg);
  }
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
		composition+='<input type="range" min="0" max="153" step="1" list="volumescale" value="'+value.volume+'"';
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
		composition+='<input type="range" min="0" max="153" step="1" list="volumescale" value="'+value.volume+'"';
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
				//console.log("[" + this.id + "] received [" + ui.item.attr("id") + "] from [" + ui.sender.attr("id") + "]");
				// xhr_get({id: ui.item.attr("id"), sink: this.id});
        socket.emit('query', {id: ui.item.attr("id"), sink: this.id});
			},
			start: function() {
				userActivity = true
			},
			stop: function() {
				userActivity = false
			}
		});
		//.disableSelection();
	});

	$('input[type="range"]').on("change",function(){
    // xhr_get({id: this.parentNode.id, volume: this.value})
    socket.emit('query', {id: this.parentNode.id, volume: this.value});
  });
	$('input[type="range"]').on('touchstart mousedown', function(){
		userActivity = true
	});
	$('input[type="range"]').on('touchend mouseup', function(){
		userActivity = false
	});
	$('input[type="checkbox"]').on("change",function(){
	   if(this.checked){
		   value = 1;
		}else{
			value = 0;
		}
      // xhr_get({id: this.parentNode.parentNode.id, mute: value});
    	socket.emit('query', {id: this.parentNode.parentNode.id, mute: value});
    });
}
