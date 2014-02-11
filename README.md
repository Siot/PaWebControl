PaWebControl
============

PulseAudio Web Volume Control

A pavucontrol web interface.

Requirements:

- PHP web server
- PulseAudio pactl command

Installation:

Setup a php web server on the computer you want to control PulseAudio and copy files inside.

Simplest way using standalone php web server:

  $ php -S 0.0.0.0:8000 -t public_html/

Use:

Point to IP:8000 of the web server with a web browser from any gadget on your lan.

Roadmap:
 - Add move input sink option
