PaWebControl
============

[![Greenkeeper badge](https://badges.greenkeeper.io/Siot/PaWebControl.svg)](https://greenkeeper.io/)

PulseAudio Web Volume Control

A pavucontrol web interface.

![ScreenShot](https://lh5.googleusercontent.com/---4u0K7RKJI/UvqIg4AuM4I/AAAAAAAAALs/vHvX5Jc0oHM/w540-h810-no/PaWebControl.png)

Requirements:

- NodeJS
- PulseAudio pactl command

Installation:

- Clone this repo.

- Run `$ npm install && npm run build`

Start server:

- Run `$ npm run start`

Usage:

Point to IP:8000 of the web server with a web browser from any gadget on your lan.

- Right checkbox = toggle mute
- Drag&drop input-sink (green box) = move input-sink between sinks (white box)
- Move slider = change volume (numeric % volum visible on textbox)

Blog (spanish): http://blog.siot.es/2014/02/pawebcontrol-interfaz-web-para.html
