let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');

let ballRadius = 6;
let ballStatic = true;

let paddleHeight = 15;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let x = canvas.width/2;
let y = canvas.height - paddleHeight - ballRadius - 5;
let dx = 0;
let dy = 0;

let brickRowCount = 3;
let brickColumnCount = 7;
let brickWidth = 100;
let brickHeight = 30;
let brickPadding = 7;
let brickOffSetTop = 40;
let brickOffSetLeft = 30;
let brickColor = ["#FE070D", "#FE9305", "#FEF504", "#41C901", "#2AC3FC", "#0025F3", "#5630C3"]

let rightPressed = false;
let leftPressed = false;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        bricks[c][r] = { x: 0, y: 0, status:1 };
    }
}

let score = 0;
let lives = 3;

drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#d9d9d9";
    ctx.fill();
    ctx.closePath();
}

drawPaddle = () => {
    ctx.beginPath();
    ctx.fillStyle = "#d9d9d9";
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
    ctx.closePath();
}


drawBricks = () => {
for( let c = 0; c < brickColumnCount; c++){
    for ( let r =0; r < brickRowCount; r++){
        let brickX = (c *(brickWidth + brickPadding)+brickOffSetLeft);
        let bricky = (r *(brickHeight + brickPadding)+brickOffSetTop);
        bricks[c][r].x = brickX;
        bricks[c][r].y = bricky;
        if(bricks[c][r].status == 1){
            ctx.beginPath();
            ctx.rect(brickX, bricky, brickWidth, brickHeight);
            ctx.fillStyle = brickColor[c];
            ctx.fill();
            ctx.closePath();
        }
    }
}
}

drawScore = () => {
    ctx.font = "16px arial";
    ctx.fillStyle = "#d9d9d9";
    ctx.fillText("Score:" + score,8,20);
}

drawLives = () => {
    ctx.font = "16px arial";
    ctx.fillStyle = "#d9d9d9";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20 );
}

drawGameOver = () => {
    ctx.beginPath();
    ctx.fillStyle = "#f23";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2 -20 );
    ctx.font = "normal 24px arial";
    ctx.fillText("hit return to try again", canvas.width / 2 - 100, canvas.height / 2 + 30 );
    ctx.closePath();
}

drawWinGame = () => {
    ctx.beginPath();
    ctx.fillStyle = "#41C901";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px arial";
    ctx.fillStyle = "#1e5b00";
    ctx.fillText("VICTORY!!", canvas.width / 2 - 130, canvas.height / 2 -20 );
    ctx.font = "normal 24px arial";
    ctx.fillText("hit return to go again", canvas.width / 2 - 110, canvas.height / 2 + 30 );
    ctx.closePath();
}

draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    }

    if(y + dy < ballRadius){
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius - paddleHeight){
        if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius){
            dy = -dy;
        }
        else {
            lives --;
            if(!lives){
                drawGameOver();
                return
            } else {
                x = paddleX + (paddleWidth / 2);
                y = canvas.height - paddleHeight - ballRadius - 5;
                dx = 0;
                dy = 0;
                ballStatic = true;
            }
        }
    }

    if(rightPressed){
        paddleX  += 7;
        if(ballStatic){
            x = paddleX + (paddleWidth / 2);
        }
        if(paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth
        }
    }
    else if (leftPressed){
        paddleX -= 7;

        if(ballStatic){
            x = paddleX + (paddleWidth / 2);
        }
        if(paddleX < 0){
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;

    //collisionDetection
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];

            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score ++;
                    if(score == brickColumnCount * brickRowCount){
                        drawWinGame();
                        return
                    }
                }
            }
        }
    }
    requestAnimationFrame(draw);
}

keyDownHandler = (e) => {
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
    else if (e.key == " " && ballStatic == true){
        dx = 2;
        dy = -2;
        ballStatic = false;
       }
    else if (e.key == "Enter" && lives == 0){
        document.location.reload();
    }
    else if (e.key == "Enter" && score == brickColumnCount * brickRowCount){
        document.location.reload();
    }

}

keyUpHandler = (e) => {
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
draw();
