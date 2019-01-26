function pageInit() {
    const gameCanvas = document.getElementById("game-canvas");
    const gameContext = gameCanvas.getContext("2d");
    var towerList = [];
    var occupiedSpots = [];
    var testDiv = document.getElementById("test");
    var currSquare = {
        xPos: 0,
        yPos: 0
    };
    var wave = [];
    var userMenu = document.forms.user_menu;

    // Constructor function for a tower
    function BasicTower(xStart, yStart, power) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.power = power;

        this.redraw = function() {
            gameContext.beginPath();
            gameContext.strokeStyle = "#000";

            // Head
            gameContext.moveTo(this.xStart + 25, this.yStart);
            gameContext.arc(this.xStart, this.yStart, 25, 0, Math.PI * 2, true);

            // Mouth
            gameContext.moveTo(this.xStart + 15, this.yStart);
            gameContext.arc(this.xStart, this.yStart, 15, 0, Math.PI, false);

            // Left Eye
            gameContext.moveTo(this.xStart - 5, this.yStart - 10);
            gameContext.arc(this.xStart - 10, this.yStart - 10, 5, 0, 
                Math.PI * 2, false);

            // Right Eye
            gameContext.moveTo(this.xStart + 15, this.yStart - 10);
            gameContext.arc(this.xStart + 10, this.yStart - 10, 5, 0, 
                Math.PI * 2, false);

            gameContext.stroke();
            gameContext.closePath();
        }

        this.attack = function() {
            for (let i = 0; i < towerList.length; i++) {
                for (let j = 0; j < wave.length; j++) {
                    let xDist = Math.abs(wave[j].xPos - towerList[i].xStart);
                    let yDist = Math.abs(wave[j].yPos - towerList[i].yStart);
                    if (Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)) < 200) {
                        this.lazer(i, j);
                        wave[j].hp -= this.power;
                        if (wave[j].hp <= 0) {
                            if (j === 0) {
                                wave.splice(0, 1);
                            }
                            else {
                                wave.splice(j, j);
                            }
                        }
                    }
                }
            }
        }

        this.lazer = function(towerIndex, enemyIndex) {
            gameContext.beginPath();
            gameContext.strokeStyle = "blue";
            gameContext.moveTo(towerList[towerIndex].xStart, towerList[towerIndex].yStart);
            gameContext.lineTo(wave[enemyIndex].xPos + 25, wave[enemyIndex].yPos + 15);
            gameContext.stroke();
            gameContext.closePath();
        }
    }

    function StrongTower(xStart, yStart, power) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.power = power;

        this.redraw = function() {
            gameContext.fillStyle = "orange";
            gameContext.fillRect(this.xStart, this.yStart, 50, 50);
        }

        this.attack = function() {
            for (let i = 0; i < towerList.length; i++) {
                for (let j = 0; j < wave.length; j++) {
                    let xDist = Math.abs(wave[j].xPos - towerList[i].xStart);
                    let yDist = Math.abs(wave[j].yPos - towerList[i].yStart);
                    if (Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)) < 200) {
                        this.lazer(i, j);
                        wave[j].hp -= this.power;
                        if (wave[j].hp <= 0) {
                            if (j === 0) {
                                wave.splice(0, 1);
                            }
                            else {
                                wave.splice(j, j);
                            }
                        }
                    }
                }
            }
        }

        this.lazer = function(towerIndex, enemyIndex) {
            gameContext.beginPath();
            gameContext.strokeStyle = "pink";
            gameContext.moveTo(towerList[towerIndex].xStart, towerList[towerIndex].yStart);
            gameContext.lineTo(wave[enemyIndex].xPos + 25, wave[enemyIndex].yPos + 15);
            gameContext.stroke();
            gameContext.closePath();
        }
    }

    function Enemy(xStart, yStart, hp, speed, image) {
        this.enemyImg = image;
        this.xPos = xStart;
        this.yPos = yStart;
        this.hp = hp;
        this.speed = speed;

        this.redraw = function() {
            gameContext.drawImage(this.enemyImg, this.xPos + 10, 
                this.yPos, 30, 30);
            this.yPos += speed;
        }
    }

    function initOccupiedSpots () {
        for (let i = 0; i < gameCanvas.height / 50; i++) {
            var newRow = [];
            for (let j = 0; j < gameCanvas.width / 50; j++) {
                newRow[j] = false;
            }
            occupiedSpots[i] = newRow;
        }
    }

    function drawGrid(){
        gameContext.beginPath();
        gameContext.strokeStyle = "#E0E0E0";
        for (let i = 50; i < gameCanvas.height; i += 50) {
            gameContext.moveTo(0, i);
            gameContext.lineTo(gameCanvas.width, i);
        }

        for (let i = 50; i < gameCanvas.width; i += 50) {
            gameContext.moveTo(i, 0);
            gameContext.lineTo(i, gameCanvas.height);
        }
        gameContext.stroke();
        gameContext.closePath();
    }

    function updateCanvas() {
        // Clear Canvas
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Highlight the box corresponding to the current mouse position
        gameContext.fillStyle = "lightblue";
        gameContext.fillRect(currSquare.xPos, currSquare.yPos, 50, 50);
        
        // Home
        gameContext.fillStyle = "green";
        gameContext.fillRect(300, 550, 50, 50);

        // Spawn Spot
        gameContext.fillStyle = "red";
        gameContext.fillRect(300, 0, 50, 50);

        drawGrid();

        // Redraw Wave
        for (let i = 0; i < wave.length; i++) {
            if (wave[i].yPos < gameCanvas.height - 50) {
                wave[i].redraw();
            }
            else {
                wave.shift();
            }
        }

        // Redraw Towers
        for (let i = 0; i < towerList.length; i++) {
            towerList[i].redraw();
            towerList[i].attack();
        }
    }

    function createTower() {
        if (!occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50]) {
            if (userMenu.tower_select.value === "1") {
                var newTower = new BasicTower(currSquare.xPos + 25, currSquare.yPos + 25, 1);
                towerList.push(newTower);
                occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50] = true;
            }
            else if (userMenu.tower_select.value === "2") {
                var newTower = new StrongTower(currSquare.xPos, currSquare.yPos, 5);
                towerList.push(newTower);
                occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50] = true;
            }
        }
    }

    function spawnWave() {
        var waveDelay = 0;
        var enemyImg = new Image();
        enemyImg.src = "images/lolface2.png";

        for (let i = 0; i < 10 ; i++) {
            setTimeout(function () {
                wave.push(new Enemy(300, 0, 25, 5, enemyImg));
            }, waveDelay);
            waveDelay += 2000;
        }
    }

    gameCanvas.onclick = function (e) {
        createTower();
    };

    // When the mouse moves within the canvas this function will update the
    // currSquare object to correspond to the box the mouse is in
    gameCanvas.onmousemove = function (e) {
        var canvasBounds = gameCanvas.getBoundingClientRect();
        var xSquareNum = Math.floor((e.clientX - canvasBounds.left) / 50);
        var ySquareNum = Math.floor((e.clientY - canvasBounds.top) / 50);

        currSquare = {
            xPos: xSquareNum * 50,
            yPos: ySquareNum * 50
        };
    };

    spawnWave();
    initOccupiedSpots();
    var updateInterval = setInterval(updateCanvas, 100);
}

window.onload = pageInit;