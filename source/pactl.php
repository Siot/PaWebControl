<?php
  $panel = new Pactl();
  if(isset($_REQUEST['id'])){
	  if(isset($_REQUEST['volume']))
	  {
		$panel->setVolume($_REQUEST['id'],$_REQUEST['volume']);
	  }
	  if(isset($_REQUEST['mute'])){
		  $panel->setMute($_REQUEST['id'],$_REQUEST['mute']);
	  }
	  if(isset($_REQUEST['sink'])){
		  $panel->move($_REQUEST['id'],$_REQUEST['sink']);
	  }
	  unset($panel);
	  $panel = new Pactl();
	}
	echo json_encode(objectToArray($panel));

  class Pactl {
	const LANG = "LANG=C";
	const CMD = "pactl";
	public $sinks = array();
	public $inputs = array();
	
	public function __construct(){
		$this->update();
	}
	
	private function clear() {
		foreach($this->sinks as $key => &$value){
			unset($this->sinks[$key]);
		}
		unset($value);
		foreach($this->inputs as $key => &$value){
			unset($this->inputs[$key]);
		}
		unset($value);
	}
	
	private function update() {
		$this->clear();
		
		//Create input sinks
		exec(Pactl::LANG . " " . Pactl::CMD . " " . "list" . " " . SinkInput::CMD, $output);
		$filteredOutput = array_filter($output,"SinkInput::sink_inputs_filter");
		$filteredOutput = array_values($filteredOutput);
		array_walk($filteredOutput, create_function('&$val', '$val = ltrim($val);')); 
		$filteredOutput = array_chunk($filteredOutput, 5);
		foreach($filteredOutput as $sinkInput){
			// Sink number = array key
			$id = substr($sinkInput[0], strpos($sinkInput[0], "#")+1);
			$this->inputs[$id] = new SinkInput($sinkInput);
		}
		unset($output);
		unset($filteredOutput);
		unset($id);
		
		//Create output sinks
		exec(Pactl::LANG . " " . Pactl::CMD . " " . "list" . " " . Sink::CMD, $output);
		$filteredOutput = array_filter($output,"Sink::sinks_filter");
		$filteredOutput = array_values($filteredOutput);
		array_walk($filteredOutput, create_function('&$val', '$val = ltrim($val);')); 
		$filteredOutput = array_chunk($filteredOutput, 4);
		foreach($filteredOutput as $sink){
			// Sink number = array key
			$id = substr($sink[0], strpos($sink[0], "#")+1);
			$this->sinks[$id] = new Sink($sink);
		}
	}
	
	public function setVolume($id,$volume) {
		if(substr($id,0,1)==="s"){
			$this->sinks[substr($id,1)]->setVolume($volume);
		}else{
			$this->inputs[substr($id,1)]->setVolume($volume);
		}
		$this->update();
	}
	
	public function setMute($id,$mute) {
		if(substr($id,0,1)==="s"){
			$this->sinks[substr($id,1)]->setMute($mute);
		}else{
			$this->inputs[substr($id,1)]->setMute($mute);
		}
		$this->update();
	}
	
	public function move($id,$sink) {
		$this->inputs[substr($id,1)]->move(substr($sink,1));
		$this->update();
	}
  }
	
	class Sink {
		const CMD = "sinks";
		public $id;
		public $description;
		public $mute;
		public $volume;
		
		public function __construct($data){
   		    // Sink input number
			$this->id = substr($data[0], strpos($data[0], "#")+1);
			// Sink description
			$this->description = substr($data[1], strpos($data[1], ":")+2);
			// Mute
			$this->mute = substr($data[2], strpos($data[2], ":")+2);
			// Volume
			preg_match_all('/([\d]+%)/', $data[3], $volumes);
			array_walk($volumes[0], create_function('&$val', '$val = rtrim($val,"%");'));
			$this->volume = array_sum($volumes[0]) / count($volumes[0]);
		}
		public function setVolume($value) {
			exec(Pactl::LANG . " " . Pactl::CMD . " " . "set-sink-volume" . " " . $this->id . " " . $value . "%");
		}
		public function setMute($value) {
			exec(Pactl::LANG . " " . Pactl::CMD . " " . "set-sink-mute" . " " . $this->id . " " . $value);
		}
		
		static public function sinks_filter($data){
			$elements = array(
					"Sink",
					"Description",
					"Mute",
					"Volume"
				);
			$contained = false;
			foreach($elements as &$element)
			{
				if(strpos(ltrim($data),$element) === 0){
					$contained = true;
				}
			}
			return $contained;
		}
	}
	
	
	class SinkInput {
		const CMD = "sink-inputs";
		public $id;
		public $sink;
		public $mute;
		public $volume;
		public $name;

		public function __construct($data){
		   // Sink input number
			$this->id = substr($data[0], strpos($data[0], "#")+1);
			// Sink number
			$this->sink = substr($data[1], strpos($data[1], ":")+2);
			// Mute
			$this->mute = substr($data[2], strpos($data[2], ":")+2);
			// Volume
			//$this->volume = substr($data[3], strpos($data[3], ":")+2);
			preg_match_all('/([\d]+%)/', $data[3], $volumes);
			array_walk($volumes[0], create_function('&$val', '$val = rtrim($val,"%");'));
			$this->volume = array_sum($volumes[0]) / count($volumes[0]);
			// Name
			$this->name = trim(substr($data[4], strpos($data[4], "=")+3), '"');
		}
		public function setVolume($value) {
			exec(Pactl::LANG . " " . Pactl::CMD . " " . "set-sink-input-volume" . " " . $this->id . " " . $value . "%");
		}
		public function setMute($value) {
			exec(Pactl::LANG . " " . Pactl::CMD . " " . "set-sink-input-mute" . " " . $this->id . " " . $value);
		}
		
		public function move($value) {
			exec(Pactl::LANG . " " . Pactl::CMD . " " . "move-sink-input" . " " . $this->id . " " . $value);
		}
		
		
		static public function sink_inputs_filter($data){
			$elements = array(
					"Sink Input",
					"Sink:",
					"Mute",
					"Volume:",
					"application.name"
				);
			$contained = false;
			foreach($elements as &$element)
			{
				if(strpos(ltrim($data),$element) === 0){
					$contained = true;
				}
			}
			return $contained;
		}
	}

function objectToArray($d) {
	if (is_object($d)) {
		// Gets the properties of the object
		$d = get_object_vars($d);
	}

	if (is_array($d)) {
		return array_map(__FUNCTION__, $d);
	} else {
		// Return array
		return $d;
	}
}

?>
