var x = 'canvas-x',
	y = "canvas-y",
	z = "canvas-z";
var $x,
	$y,
	$z;
// x,y,z,ani,random
var checked = [false, false, false, false, false];
var canvas_x_obj = document.querySelector('.mouse-x'),
	canvas_y_obj = document.querySelector('.mouse-y');
var body = document.body;
canvas_x_obj.style.transform = `rotateX(-45deg)`
canvas_y_obj.style.transform = `rotateY(45deg)`

$(function() {
	$x = $(`.${x}`),
		$y = $(`.${y}`),
		$z = $(`.${z}`);
	$('.xBtn').on('click', function(e) {
		initClick($x, 0, $(this));
	});
	$('.yBtn').on('click', function(e) {
		initClick($y, 1, $(this));
	});
	$('.zBtn').on('click', function(e) {
		initClick($z, 2, $(this));
	});
	$('.mourseCon').on('click', function(e) {
		openMouseAni($(this));
	})
})
//X-Y-Z
function initClick($obj, index, $click) {
	if (checked[index]) {
		checked[index] = false;
		$click.css('background-color', '#444444');
		paused($obj);
		return;
	}
	checked[index] = true;
	$click.css('background-color', 'green');
	running($obj);
}

function running($obj) {
	$obj.removeClass('canvas-ani-paused');
	$obj.addClass('canvas-ani-running');
}

function paused($obj) {
	$obj.removeClass('canvas-ani-running');
	$obj.addClass('canvas-ani-paused');
}

let startInfo = {};
//move
function openMouseAni($obj) {
	if (checked[3]) {
		checked[3] = false;
		$obj.css('background-color', '#444444');
		body.removeEventListener("mousedown", moveStart);
		body.removeEventListener('touchstart', moveStart);
		body.removeEventListener("mouseup", moveEnd);
		body.removeEventListener('touchend', moveEnd);
	} else {
		checked[3] = true;
		$obj.css('background-color', 'green');
		body.addEventListener("mousedown", moveStart);
		body.addEventListener('touchstart', moveStart);
		body.addEventListener("mouseup", moveEnd);
		body.addEventListener('touchend', moveEnd);
	}
}

function moveStart(e) {
	let currRotateX = canvas_x_obj.style.transform.match(/[0-9-.]+/g);
	let currRotateY = canvas_y_obj.style.transform.match(/[0-9-.]+/g);
	startInfo = {
		x: e.clientX || e.touches[0].clientX,
		y: e.clientY || e.touches[0].clientY,
		startRotateX: currRotateX - 0,
		startRotateY: currRotateY - 0
	}
	this.addEventListener('mousemove', move);
	this.addEventListener('touchmove', move);
}

function move(e) {
	event.preventDefault()
	let now = {
			x: e.clientX || e.touches[0].clientX,
			y: e.clientY || e.touches[0].clientY,
		},
		nextRotateY = now.x - startInfo.x + startInfo.startRotateY,
		nextRotateX = startInfo.y - now.y + startInfo.startRotateX;
	canvas_x_obj.style.transform = `rotateX(${nextRotateX}deg)`
	canvas_y_obj.style.transform = `rotateY(${nextRotateY}deg)`
}

function moveEnd(e) {
	body.removeEventListener('mousemove', move);
	body.removeEventListener('touchmove', move);
}
