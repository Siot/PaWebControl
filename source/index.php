<!DOCTYPE html>
<html>
<head>
	<meta charset=utf-8 />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
	<script type="text/javascript" src="pactl.js"></script>
	<style>
		input[type="range"]{
			height: 40px;
			width: 99%;
			margin: 0;
			vertical-align:middle;
		}
		input[type="text"]{
			width: 3em;
			text-align:center;
			vertical-align:middle;
		}
		.inputsink{
			background-color: #d3d9c6;
		}
		#sinks div{
			padding:2px 0;
		}
		body{
			margin:0;
			padding:0;
		}
	</style>
</head>
<body>
	<div id="sinks"></div>
</body>
</html>
