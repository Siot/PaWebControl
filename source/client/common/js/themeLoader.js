var ajax = new XMLHttpRequest();

ajax.onreadystatechange = function(){
  if (ajax.readyState === XMLHttpRequest.DONE) {
    // everything is good, the response is received
    document.open()
    document.write(ajax.responseText);
    document.close();
  } else {
    // still not ready
  }
};

ajax.open("GET", "themes/"+theme+"/index.html", true);
ajax.send(null);




