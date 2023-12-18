document.addEventListener("DOMContentLoaded", function () {
	var screen_width = window.innerWidth;
	const leftPaddle = document.getElementById("leftPaddle");
	const rightPaddle = document.getElementById("rightPaddle");
	const ball = document.getElementById("ball");
	const gameContainer = document.querySelector(".game-container");
	const gameContainerWidth = gameContainer.offsetWidth;
	const gameContainerHeight = gameContainer.offsetHeight;
	const shootr = document.getElementById("shootr");
	let shootr_counter = 0;
	let keyPressedTime;
	let movementEnabled = true;
	let shootEnabled = true;
	let upPressed = false;
	let downPressed = false;
	let wPressed = false;
	let sPressed = false;
	let lcounter = 0;
	let rcounter = 0;
	let rshooting = false;
	let rshootcommand = false;
	let c = 0;


	const containerRect = gameContainer.getBoundingClientRect();

	// Startpunkt des game-container in Bezug auf das Dokument
	const containerStartX = containerRect.left + window.scrollX;
	const containerStartY = containerRect.top + window.scrollY;


	let ballX = 300;
	let ballY = 200;
	let ballSpeedX = 3;
	let ballSpeedY = 5;

	let leftPaddleY = 100;
	let rightPaddleY = 100;

	function updateGame() {
		moveBall();
		movePaddles();
		checkCollision();
		shooting_animation_r();
		requestAnimationFrame(updateGame);
		winna();
	}

	window.addEventListener("resize", function() {
		// Die Funktion erneut aufrufen, wenn sich die Bildschirmbreite ändert
		updateScreenWidth();
	})

	function updateScreenWidth() {
		console.log(screen_width, "px");
		gameContainer.style.width = screen_width * 0.6;
	}

	function moveBall() {
		ballX += ballSpeedX;
		ballY += ballSpeedY;

		if (ballX <= 0 || ballX >= gameContainerWidth) {
			ballSpeedX = -ballSpeedX;
		}

		if (ballY <= 0 || ballY >= gameContainerHeight) {
			ballSpeedY = -ballSpeedY;
		}

		ball.style.left = ballX + "px";
		ball.style.top = ballY + "px";
	}

	document.addEventListener("keydown", function (event) {
		if (event.key === "ArrowUp") {
			upPressed = true;
		} else if (event.key === "ArrowDown") {
			downPressed = true;
		} else if (event.key === "w") {
			wPressed = true;
		} else if (event.key === "s") {
			sPressed = true;
		}
		if (event.key === "ArrowLeft") {
			if (shootEnabled) {
				rshootcommand = true;
				shootFromRight();
				shootEnabled = false;
				setTimeout(() => {
					shootEnabled = true;
				}, 2000);
			}
		}

		// Aufruf der Bewegungslogik
		movePaddles();
	});

	document.addEventListener("keyup", function (event) {
		console.log(event.key);
		isKeyPressed = false;
		if (event.key === "ArrowUp") {
			upPressed = false;
		} else if (event.key === "ArrowDown") {
			downPressed = false;
		} else if (event.key === "w") {
			wPressed = false;
		} else if (event.key === "s") {
			sPressed = false;
		}

		// Aufruf der Bewegungslogik
		movePaddles();
	});

	function shooting_animation_r() {
		if (rshooting == true) {
			shootr_counter += 5;
			//console.log(c);
			shootr.style.right = shootr_counter + "px";
		}
	}

	function shootFromRight() {
		if (rshooting == false && rshootcommand == true) {
			shootr.style.right = 20 + "px";
			shootr.style.top = rightPaddleY + 20 + "px";
			shootr.style.display = "block";
			shootr_counter = 20;
			rshooting = true;
		} 
	}

	function movePaddles() {
		if (movementEnabled) {
			if (upPressed && rightPaddleY > 20) {
				rightPaddleY -= 20;
			} else if (downPressed && rightPaddleY < gameContainer.clientHeight - 60) {
				rightPaddleY += 20;
			}

			if (wPressed && leftPaddleY > 20) {
				leftPaddleY -= 20;
			} else if (sPressed && leftPaddleY < gameContainer.clientHeight - 60) {
				leftPaddleY += 20;
			}

			leftPaddle.style.top = leftPaddleY + "px";
			rightPaddle.style.top = rightPaddleY + "px";

			movementEnabled = false;
			setTimeout(() => {
				movementEnabled = true;
			}, 50);
		}
	}

	function reset_game() {
		rcounter = 0;
		lcounter = 0;
		document.getElementById("counter-right").innerText = 0;
		document.getElementById("counter-left").innerText = 0;
		ballX = gameContainerWidth / 2;
		ballX = gameContainerWidth / 2;
	}

	function checkCollision() {
		// Ball-Paddle-Kollision für das linke Paddle
		if (
			ballX <= 10 && // x-Koordinate des linken Paddles
			ballX >= 0 &&
			ballY >= leftPaddleY &&
			ballY <= leftPaddleY + 50
		) {
			ballSpeedX = -ballSpeedX; // Umkehrung der x-Richtung des Balls
			console.log("hit left");
		}

		// Ball-Paddle-Kollision für das rechte Paddle
		if (
			ballX >= gameContainerWidth - 20 && // x-Koordinate des rechten Paddles
			ballY >= rightPaddleY &&
			ballY <= rightPaddleY + 50
		) {
			ballSpeedX = -ballSpeedX; // Umkehrung der x-Richtung des Balls
			console.log("hit rechts");
		}

		// Ball-Wand-Kollision oben/unten
		if (ballY <= 10 || ballY >= gameContainer.clienwwtHeight) {
			ballSpeedY = -ballSpeedY; // Umkehrung der y-Richtung des Balls
		}
		if (ballX <= 0 || ballX >= gameContainer.offsetWidth - 10) {
			ballSpeedX = -ballSpeedX; // Umkehrung der x-Richtung des Balls
		}
		// Ball-Wand-Kollision rechts
		if (ballX >= gameContainer.offsetWidth - 10) {
			lcounter += 1;
			document.getElementById("counter-left").innerText = lcounter;
			ballX = gameContainerWidth / 2;
			ballX = gameContainerWidth / 2;
		}
		// Ball-Wand-Kollision links
		if (ballX < 1) {
			rcounter += 1;
			document.getElementById("counter-right").innerText = rcounter;
			ballX = gameContainerWidth / 2;
			ballX = gameContainerWidth / 2;
			ballSpeedX = -ballSpeedX;
		}

		if (shootr_counter > gameContainer.offsetWidth)
		{
			rshooting = false;
			rshootcommand = false;
			shootr.style.display = "none";
		}
	}

	function winna() {
		if (lcounter == 7) {
			alert("Charlotte hat gewonnen, du lappen :)");
			reset_game();
		}
		if (rcounter == 7) {
			alert("Ben  hat gewonnen, du looser :)");
			reset_game();
		}
	}


	updateGame();
});
