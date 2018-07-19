var socket = io();

function getMessage() {
	console.log('Connected to server');
  	var name = document.getElementById('name')
  	var message = document.getElementById('message')

  	document.getElementById('submit').onclick = function(){
	  	fetchPostData()
	}
}

socket.on('connect', function () {
  getMessage()
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

socket.on('updatedMessage', function (message) {
	$('.message').append( "<div>"
		+		"<p>" + "<b>" + message.from + "</b>" + ' @' + message.createdAt + "</p>"
		+ 		"<p>" + message.text + "</p>"
		+ 	"</div>" );
  	console.log('updatedMessage', message);
});



function fetchPostData() {
	var name = document.getElementById('name')
		var message = document.getElementById('message')

	var data0 = {
	  name: name.value,
	  message: message.value
	}

	var jsonData = JSON.stringify(data0); 
  	var saveData = $.ajax({
      	method: 'POST',
      	crossDomain: true,
      	headers: {
		    "Content-Type": "application/json",
	  	},
      	url: "http://localhost:3001/chat",
  		data: jsonData,
      	dataType: "json",
      	success: function(resultData) { 
      		socket.emit('createMessage', {
			    from: resultData.props.name,
			    text: resultData.props.message
		  	});
      	},
      	error: function(resultData) { 
      		$('.errorMessage').html("")
      		$.each( resultData.responseJSON.errors, function( key, value ) {
			  $('.errorMessage').append('<p>' + value.msg + '</p>')
			});
      	}
	});
}

