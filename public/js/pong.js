// draw canvas

function handleChange() {
  console.log("Hello");

  const canvas = document.createElement("CANVAS");

  canvas.id = "myCanvas";
  canvas.width = 600;
  canvas.height = 400;
  canvas.style.border = "white 2px solid";
  const context = canvas.getContext("2d");
  context.fillStyle = "#000000";

  var width = canvas.width;
  var height = canvas.height;
  var upPressed = false;
  var downPressed = false;

  document.body.appendChild(canvas);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
      upPressed = true;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
      downPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
      upPressed = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
      downPressed = false;
    }
  }

  // create com paddle
  // const com = {
  //     x : 0,
  //     y : height/2-50,
  //     w : 15,
  //     h : 100,
  //     color : "white"
  // }

  // create user paddle
  const user = {
    x: width - 15,
    y: height / 2 - 50,
    w: 15,
    h: 100,
    color: "white",
  };

  // create ball
  const ball = {
    x: width / 2,
    y: height / 2,
    r: 10,
    speed: 7,
    xVelocity: 3,
    yVelocity: 3,
    startingAngle: 0,
    endingAngle: 2 * Math.PI,
    antiClock: false,
  };

  // make peddle
  function peddle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }

  // make circle
  function circle(x, y, r, startingAngle, endingAngle, antiClock) {
    context.beginPath();
    context.arc(x, y, r, startingAngle, endingAngle, antiClock);
    context.closePath();
    context.fill();
  }

  // draw net
  function drawNet() {
    for (let index = 0; index < height; index++) {
      peddle(width / 2 - 1.5, index, 3, 20);
      index += 40;
    }
  }

  // render game
  function render() {
    // draw canvas
    peddle(0, 0, canvas.width, canvas.height, "black");

    // draw com paddle
    // peddle(com.x, com.y, com.w, com.h , com.color);

    // draw user peddle
    peddle(user.x, user.y, user.w, user.h, user.color);

    // draw circle
    circle(
      ball.x,
      ball.y,
      ball.r,
      ball.startingAngle,
      ball.endingAngle,
      ball.antiClock
    );

    // draw net
    drawNet();
  }

  // move peddle

  // collition detection
  function collition(b, p) {
    // for ball
    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;

    // for peddle
    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    return (
      b.right > p.left &&
      b.bottom > p.top &&
      b.top < p.bottom &&
      b.left < p.right
    );
  }

  // reset ball
  function resetBall() {
    ball.x = width / 2;
    ball.y = height / 2;

    ball.speed = 7;
    ball.xVelocity = 3;
    ball.yVelocity = 3;
  }

  // update game
  function update() {
    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;

    if (ball.y + ball.r >= height || ball.y - ball.r <= 0) {
      ball.yVelocity = -ball.yVelocity;
    } else if (ball.x - ball.r < +0) {
      ball.xVelocity = -ball.xVelocity;
    }

    if (upPressed) {
      user.y -= 8;
      if (user.y < 0) {
        user.y = 0;
      }
    } else if (downPressed) {
      user.y += 8;
      if (user.y + user.h > height) {
        user.y = height - user.h;
      }
    }

    if (collition(ball, user)) {
      // where the ball hit the user
      let colidePoint = ball.y - (user.y + user.h / 2);

      // // normalization
      colidePoint = colidePoint / (user.h / 2);

      // // calculate the ange in radian
      let angleRad = (colidePoint * Math.PI) / 4;

      // // x direction of ball when its hit
      // let direction = (ball.x<width/2)?ball.xVelocity:-ball.xVelocity;

      // change the x and y
      ball.xVelocity = -1 * ball.speed * Math.cos(angleRad);
      ball.yVelocity = ball.speed * Math.sin(angleRad);

      // ball.xVelocity = -ball.xVelocity;

      // every time ball hit the peddle
      ball.speed += 0.5;
    }

    // reset the game
    if (ball.x > width) {
      resetBall();
    }
  }

  function game() {
    update();
    render();
  }

  const framePerSecond = 50;
  setInterval(game, 1000 / framePerSecond);
}

document.getElementById("start-btn").addEventListener("click", function (e) {
  document.getElementById("whole-body").remove();
  setTimeout(function () {
    handleChange();
  }, 3000);
});


