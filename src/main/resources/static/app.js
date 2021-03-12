var stompClient = null;

function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if (connected) {
		$("#chat").show();
	} else {
		$("#chat").hide();
	}
	$("#chat").html("");
}

//���� ����
function connect() {
	var socket = new SockJS('/wonchul-websocket');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		setConnected(true);
		console.log('Connected: ' + frame);
		// ���忡 ���� ����
		stompClient.subscribe('/chat/hello', function(msg) {
			showHello(JSON.parse(msg.body));
		});
		// ���忡 ���� �޽��� ����
		stompClient.subscribe('/chat/detail', function(msg) {
			showDetail(JSON.parse(msg.body));
		});
		// ���忡 ���� ����
		stompClient.subscribe('/chat/bye', function(msg) {
			showBye(JSON.parse(msg.body));
		});
		sendHello();
	});
}

//���� ���� ����
function disconnect() {
	if (stompClient != null) {
		sendBye();
		stompClient.disconnect();
	}
	setConnected(false);
	
	console.log("Disconnected");
}

function sendHello() {
	stompClient.send("/hello", {}, JSON.stringify({
		name	 : $('#name').val()
	}));
}

function sendDetail() {
	stompClient.send("/detail", {}, JSON.stringify({
		name	 : $('#name').val(),
		contents : $('#btn-input').val()
	}));
}

function sendBye() {
	stompClient.send("/bye", {}, JSON.stringify({
		name	 : $('#name').val()
	}));
}

function showDetail(message) {
	var html = "";
	if(message.name == $('#name').val()){
		html += '<li class="left clearfix">';
		html += '	<span class="chat-img pull-right">'
		html += '		<img src="http://placehold.it/50/FA6F57/fff" alt="User Avatar" class="img-circle">';
		html += '	</span>';
		html += '	<div class="chat-body clearfix">';
		html += '		<div class="header">';
		html += '		<strong class="pull-right primary-font">' + message.name + '</strong>';
		html += '		<small class="text-muted">';
		html += '			<i class="fa fa-clock-o fa-fw"></i>' + new Date(message.sendDate);
		html += '		</small>';
		html += '	</div>';
		html += '	<p>';
		html += 	message.contents;
		html += '	</p>';
		html += '	</div>';
		html += '</li>';
	} else {
		html += '<li class="left clearfix">';
		html += '	<span class="chat-img pull-left">'
		html += '		<img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar" class="img-circle">';
		html += '	</span>';
		html += '	<div class="chat-body clearfix">';
		html += '		<div class="header">';
		html += '		<strong class="primary-font">' + message.name + '</strong>';
		html += '		<small class="pull-right text-muted">';
		html += '			<i class="fa fa-clock-o fa-fw"></i>' + new Date(message.sendDate);
		html += '		</small>';
		html += '	</div>';
		html += '	<p>';
		html += 	message.contents;
		html += '	</p>';
		html += '	</div>';
		html += '</li>';
	}
	
	$(".chat").append(html);
	$('.panel-body').scrollTop($(".chat")[0].scrollHeight);
}

function showHello(message) {
	var html = "";
	
	html += '<li class="left clearfix">';
	html += '	<div class="chat-body clearfix">';
	html += '	<div class="header">';
	html += '		<strong class="primary-font">' + message.name + '</strong>';
	html += '		<small class="pull-right text-muted">';
	html += '			<i class="fa fa-clock-o fa-fw"></i>' + new Date(message.sendDate);
	html += '		</small>';
	html += '	</div>';
	html += '	<p>';
	html += '	���� �Ͽ����ϴ�';
	html += '	</p>';
	html += '	</div>';
	html += '</li>';
	
	$(".chat").append(html);
	$('.panel-body').scrollTop($(".chat")[0].scrollHeight);
}

function showBye(message) {
	var html = "";
	
	html += '<li class="left clearfix">';
	html += '	<div class="chat-body clearfix">';
	html += '	<div class="header">';
	html += '		<strong class="primary-font">' + message.name + '</strong>';
	html += '		<small class="pull-right text-muted">';
	html += '			<i class="fa fa-clock-o fa-fw"></i>' + new Date(message.sendDate);
	html += '		</small>';
	html += '	</div>';
	html += '	<p>';
	html += '	���� �Ͽ����ϴ�';
	html += '	</p>';
	html += '	</div>';
	html += '</li>';
	
	$(".chat").append(html);
	$('.panel-body').scrollTop($(".chat")[0].scrollHeight);
}

$(function() {
	$("form").on('submit', function(e) {
		e.preventDefault();
	});
	$("#connect").click(function() {
		// ���� ����
		connect();
	});
	$("#disconnect").click(function() {
		// ���� ���� ����
		disconnect();
	});
	$("#btn-chat").click(function() {
		// �޽��� ����
		sendDetail();
		$('#btn-input').val('');
	});
});