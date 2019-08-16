import Sortable from 'sortablejs';
import $ from 'jquery';
import openSocket from 'socket.io-client';

const socket = openSocket();

let userActivity = false;

socket.on('data update', function(msg) {
  if (!userActivity) {
    $('#inputs div').remove();
    $('#sinks div').remove();
    showPanel(msg);
  }
});

function showPanel(data) {
  $.each(data.sinks, function(key, value) {
    let composition = '<div id="s' + value.id + '" class="sortable">';
    composition += '<span><input type="checkbox"';
    if (value.mute === 'yes') {
      composition += ' checked ';
    }
    composition += '/>';
    composition += '<input type="text" value="' + value.volume + '" disabled /> ';
    composition += value.description + '</span>';
    composition +=
      '<input type="range" min="0" max="153" step="1" list="volumescale" value="' +
      value.volume +
      '"';
    if (value.mute === 'yes') {
      composition += ' disabled ';
    }
    composition += ' />';
    composition += `<div id="s${value.id}-inputsinks"></div></div>`;
    $('#sinks').append(composition);

    Sortable.create(document.getElementById(`s${value.id}-inputsinks`), {
      group: 'inputsinks',
      handle: '.sortable-handler',
      onAdd: event => {
        socket.emit('query', { id: event.item.id, sink: 's' + value.id });
      },
      onStart: () => {
        userActivity = true;
      },
      onEnd: () => {
        userActivity = false;
      }
    });
  });

  $.each(data.inputs, function(key, value) {
    let composition = '<div id="i' + value.id + '" class="inputsink">';
    composition += '<span class="sortable-handler"><input type="checkbox"';
    if (value.mute === 'yes') {
      composition += ' checked ';
    }
    composition += '/>';
    composition += '<input type="text" value="' + value.volume + '" disabled /> ';
    composition += value.name + '</span>'; //+"->"+ data.sinks[value.sink].description;
    composition +=
      '<input type="range" min="0" max="153" step="1" list="volumescale" value="' +
      value.volume +
      '"';
    if (value.mute === 'yes') {
      composition += ' disabled ';
    }
    composition += ' />';
    composition += '</div>';
    $(`#s${value.sink}-inputsinks`).append(composition);
  });

  $('input[type="range"]').on('change', function() {
    socket.emit('query', { id: this.parentNode.id, volume: this.value });
  });
  $('input[type="range"]').on('touchstart mousedown', function() {
    userActivity = true;
  });
  $('input[type="range"]').on('touchend mouseup', function() {
    userActivity = false;
  });
  $('input[type="checkbox"]').on('change', function() {
    let value;
    if (this.checked) {
      value = 1;
    } else {
      value = 0;
    }
    socket.emit('query', { id: this.parentNode.parentNode.id, mute: value });
  });
}
