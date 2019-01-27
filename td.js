function pageInit() {
    const msgArea = document.getElementById("messages");
    const gameCanvas = document.getElementById("game-canvas");
    const gameContext = gameCanvas.getContext("2d");
    const gamePanel = document.forms.game_panel;
    const scoreHeader = document.getElementById("score");
    const lifeBar = document.getElementById("life");
    const moneyHeader = document.getElementById("money");
    const upgradeButton = document.getElementById("upgrade");
    const sellButton = document.getElementById("sell");
    const startButton = document.getElementById("start-button");
    const inventory = document.getElementsByClassName("items");
    const backgroundImg = new Image();
    backgroundImg.src = "images/stages2.png";
    const buildTimer = document.getElementById("build-timer");
    const doneBuildButton = document.getElementById("build-done");
    const submitScoreButton = document.getElementById("submit-score");
    const restartButton = document.getElementById("restart");
    const mapLayout = [
    ['X', 'O', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'O', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'O', 'X', 'O', 'X', 'X', 'X', 'O', 'O', 'O', 'X', 'X', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'X'],
    ['X', 'O', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'X', 'X'],
    ['X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'B', 'O', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'B', 'B', 'B', 'B', 'O', 'O', 'X', 'X', 'X', 'X', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
    ['X', 'B', 'B', 'B', 'B', 'B', 'O', 'X', 'X', 'X', 'X', 'O', 'B', 'X', 'X', 'X', 'X', 'X', 'O', 'X'],
    ['X', 'B', 'B', 'B', 'B', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'X', 'O', 'O', 'O', 'X', 'O', 'X'],
    ['X', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'O', 'O', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'B', 'X', 'O', 'O', 'O', 'X'],
    ['X', 'X', 'O', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
    ]
    // imgsrc, delay, hp, speed
    const enemyInfo = [
    ["images/nerd.png", 500, 300, 10, 50], 
    ["images/lolface2.png", 500, 200, 5, 100], 
    ["images/pogchamp.png", 5000, 50000000, 2, 10000]
    ];
    const waveInfo = [
    [50, 0, 0],
    [50, 20, 0],
    [50, 50, 0],
    [100, 100, 0],
    [0, 0, 10]
    ]

    var updateInterval;
    var towerList = [];
    var occupiedSpots = [];
    var wave = [];
    var items = [];
    var countdown = 0;
    var waveEnd = false;
    var timerInterval;
    var waveCount = 0;
    var doneSpawn = false;
    var winFlag = true;

    
    var currSquare = {
        xPos: 0,
        yPos: 0
    };

    var clickedSquare = {
        xPos: null,
        yPos: null
    };
    
    var score = 0;
    var life = 100;
    var money = 1000;
    var refreshCount = 1;
    var slowdown = 1;

    function ArrowTower(xStart, yStart) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.power = 50;
        this.isAttacking = false;
        this.spdCount = 5;
        this.delay = 5;
        this.range = 300;
        this.angle = 0;
        this.arrowTowerImage = new Image();
        this.arrowTowerImage.src = "images/siegeBallista.png";
        this.sellPrice = 150;
        this.isUpgraded = false;
        this.upgradeCost = 750;

        this.redraw = function() {
            gameContext.save();
            gameContext.translate(this.xStart + 25, this.yStart + 25);
            gameContext.rotate(this.angle + Math.PI / 2);
            gameContext.drawImage(this.arrowTowerImage, -25, -25, 50, 50);
            gameContext.translate((-1) * this.xStart, (-1) * this.yStart);
            gameContext.restore();
        }

        this.attack = function() {
            this.isAttacking = false;
            if (this.spdCount === this.delay + 10){
                this.spdCount = 0;
            }
            this.spdCount++;
            for (let j = 0; j < wave.length; j++) {
                if (this.isAttacking === false && this.spdCount > this.delay) {
                    let xDist = wave[j].xPos - this.xStart + 25;
                    let yDist = wave[j].yPos - this.yStart + 25;
                    this.angle = Math.atan2(yDist, xDist);
                    if (Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                        Math.pow(Math.abs(yDist), 2)) < this.range) {
                        this.arrow(j);
                    if (this.spdCount === this.delay + 10) {
                        wave[j].hp -= this.power;
                    }
                    if (wave[j].hp <= 0) {
                        money += wave[j].moneyValue;
                        wave.splice(j, 1);
                        score += Math.floor(Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                            Math.pow(Math.abs(yDist), 2)));
                        randomItem();
                    }
                    this.isAttacking = true;
                }
                else {
                    this.isAttacking = false;
                } 
            }
        }
    }

    this.arrow = function(enemyIndex) {
        let centerX = this.xStart + 25;
        let centerY = this.yStart + 25;
        let xOffset = ((wave[enemyIndex].xPos + 25) - (centerX)) / 10;
        let yOffset = ((wave[enemyIndex].yPos + 15) - (centerY)) / 10;

        gameContext.beginPath();
        gameContext.moveTo(centerX + xOffset * (this.spdCount - this.delay), 
            centerY + yOffset * (this.spdCount - this.delay));
        gameContext.arc(centerX + xOffset * (this.spdCount - this.delay), 
            centerY + yOffset * (this.spdCount - this.delay), 
            5, 0, 2 * Math.PI, false);
        gameContext.fillStyle = 'green';
        gameContext.fill();
        gameContext.closePath();
    }

    this.upgrade = function() {
        this.power += 200;
        this.range += 200;
        this.isUpgraded = true;
        this.sellPrice += this.upgradeCost * 0.6;
        upgradeButton.style.display = "none";
    }
}

function LaserTower(xStart, yStart) {
    this.xStart = xStart;
    this.yStart = yStart;
    this.power = 25;
    this.isAttacking = false;
    this.range = 300;
    this.laserTowerImage = new Image();
    this.laserTowerImage.src = "images/towerDefense__laser.png";
    this.sellPrice = 450;
    this.isUpgraded = false;
    this.upgradeCost = 5000;

    this.redraw = function() {
        gameContext.save();
        gameContext.translate(this.xStart + 25, this.yStart + 25);
        gameContext.rotate(this.angle + Math.PI / 2);
        gameContext.drawImage(this.laserTowerImage, -25, -25, 50, 50);
        gameContext.translate((-1) * this.xStart, (-1) * this.yStart);
        gameContext.restore();
    }

    this.attack = function() {
        this.isAttacking = false;
        for (let j = 0; j < wave.length; j++) {
            if (this.isAttacking === false) {
                let xDist = wave[j].xPos - this.xStart + 25;
                let yDist = wave[j].yPos - this.yStart + 25;
                this.angle = Math.atan2(yDist, xDist);
                if (Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                    Math.pow(Math.abs(yDist), 2)) < this.range) {
                    this.laser(j);
                wave[j].hp -= this.power;
                if (wave[j].hp <= 0) {
                    money += wave[j].moneyValue;
                    wave.splice(j, 1);
                    score += Math.floor(Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                        Math.pow(Math.abs(yDist), 2)));
                    randomItem();
                }
                this.isAttacking = true;
            }
            else {
                this.isAttacking = false;
            }
        }
    }
}

this.laser = function(enemyIndex) {
    gameContext.beginPath();
    gameContext.strokeStyle = "red";
    gameContext.moveTo(this.xStart + 25, this.yStart + 25);
    gameContext.lineTo(wave[enemyIndex].xPos + 25, wave[enemyIndex].yPos + 15);
    gameContext.stroke();
    gameContext.closePath();
}

this.upgrade = function() {
    this.power += 200;
    this.range += 200;
    this.isUpgraded = true;
    this.sellPrice += this.upgradeCost * 0.6;
    upgradeButton.style.display = "none";
}
}

function ArtilleryTower(xStart, yStart) {
    this.xStart = xStart;
    this.yStart = yStart;
    this.power = 200;
    this.isAttacking = false;
    this.spdCount = 50;
    this.delay = 50;
    this.range = 300;
    this.artilleryTowerImage = new Image();
    this.artilleryTowerImage.src = "images/towerDefense_artillery.png";
    this.sellPrice = 300;
    this.isUpgraded = false;
    this.upgradeCost = 3500;

    this.redraw = function() {
        gameContext.save();
        gameContext.translate(this.xStart + 25, this.yStart + 25);
        gameContext.rotate(this.angle + Math.PI / 2);
        gameContext.drawImage(this.artilleryTowerImage, -25, -25, 50, 50);
        gameContext.translate((-1) * this.xStart, (-1) * this.yStart);
        gameContext.restore();
    }

    this.attack = function() {
        let xDist;
        let yDist;
        this.isAttacking = false;
        if (this.spdCount === this.delay + 10){
            this.spdCount = 0;
        }
        this.spdCount++;

        for (let j = 0; j < wave.length; j++) {
            if (this.isAttacking === false && this.spdCount > this.delay) {
                xDist = wave[j].xPos - this.xStart + 25;
                yDist = wave[j].yPos - this.yStart + 25;
                this.angle = Math.atan2(yDist, xDist);
                if (Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                    Math.pow(Math.abs(yDist), 2)) < this.range) {
                    this.boom(j);
                if (this.spdCount === this.delay + 10) {
                    for (let k = 0; k < wave.length; k++) {
                        let xProx = Math.abs(wave[j].xPos - wave[k].xPos);
                        let yProx = Math.abs(wave[j].yPos - wave[k].yPos);

                        if (Math.sqrt(Math.pow(xProx, 2) + Math.pow(yProx, 2)) < 75) {
                            if (k === j) {
                                wave[k].hp -= this.power;
                            }
                            else {
                                wave[k].hp -= this.power / 2;
                            }
                        }
                    }
                }
                this.isAttacking = true;
            }
            else {
                this.isAttacking = false;
            }
        }
    }
    for (let i = 0; i < wave.length; i++) {
        if (wave[i].hp <= 0) {
            money += wave[i].moneyValue;
            wave.splice(i, 1);
            score += Math.floor(Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                Math.pow(Math.abs(yDist), 2)));
            randomItem();
        }
    }
}

this.boom = function(enemyIndex) {
    let centerX = this.xStart + 25;
    let centerY = this.yStart + 25;
    let xOffset = ((wave[enemyIndex].xPos + 25) - (centerX)) / 10;
    let yOffset = ((wave[enemyIndex].yPos + 15) - (centerY)) / 10;

    gameContext.beginPath();
    gameContext.moveTo(centerX + xOffset * (this.spdCount - this.delay), 
        centerY + yOffset * (this.spdCount - this.delay));
    gameContext.arc(centerX + xOffset * (this.spdCount - this.delay), 
        centerY + yOffset * (this.spdCount - this.delay), 
        20, 0, 2 * Math.PI, false);
    gameContext.fillStyle = 'pink';
    gameContext.fill();
    gameContext.closePath();
}

this.upgrade = function() {
    this.power += 200;
    this.range += 200;
    this.isUpgraded = true;
    this.sellPrice += this.upgradeCost * 0.6;
    upgradeButton.style.display = "none";
}
}

function CannonTower(xStart, yStart) {
    this.xStart = xStart;
    this.yStart = yStart;
    this.power = 100;
    this.isAttacking = false;
    this.spdCount = 25;
    this.delay = 25;
    this.range = 400;
    this.cannonImage = new Image();
    this.cannonImage.src = "images/towerDefense_cannon.png";
    this.sellPrice = 210;
    this.isUpgraded = false;
    this.upgradeCost = 2000;

    this.redraw = function() {
        gameContext.save();
        gameContext.translate(this.xStart + 25, this.yStart + 25);
        gameContext.rotate(this.angle + Math.PI / 2);
        gameContext.drawImage(this.cannonImage, -25, -25, 50, 50);
        gameContext.translate((-1) * this.xStart, (-1) * this.yStart);
        gameContext.restore();
    }

    this.attack = function() {
        this.isAttacking = false;
        if (this.spdCount === this.delay + 10){
            this.spdCount = 0;
        }
        this.spdCount++;
        for (let j = 0; j < wave.length; j++) {
            if (this.isAttacking === false && this.spdCount > this.delay) {
                let xDist = wave[j].xPos - this.xStart + 25;
                let yDist = wave[j].yPos - this.yStart + 25;
                this.angle = Math.atan2(yDist, xDist);
                if (Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                    Math.pow(Math.abs(yDist), 2)) < this.range) {
                    this.cannon(j);
                if (this.spdCount === this.delay + 10) {
                    wave[j].hp -= this.power;
                }
                if (wave[j].hp <= 0) {
                    money += wave[j].moneyValue;
                    wave.splice(j, 1);
                    score += Math.floor(Math.sqrt(Math.pow(Math.abs(xDist), 2) + 
                        Math.pow(Math.abs(yDist), 2)));
                    randomItem();
                    this.isAttacking = false;
                }
                this.isAttacking = true;
            }
            else {
                this.isAttacking = false;
            } 
        }
    }
}

this.cannon = function(enemyIndex) {
    let centerX = this.xStart + 25;
    let centerY = this.yStart + 25;
    let xOffset = ((wave[enemyIndex].xPos + 25) - (centerX)) / 10;
    let yOffset = ((wave[enemyIndex].yPos + 15) - (centerY)) / 10;

    gameContext.beginPath();
    gameContext.moveTo(centerX + xOffset * (this.spdCount - this.delay), 
        centerY + yOffset * (this.spdCount - this.delay));
    gameContext.arc(centerX + xOffset * (this.spdCount - this.delay), 
        centerY + yOffset * (this.spdCount - this.delay), 
        10, 0, 2 * Math.PI, false);
    gameContext.fillStyle = 'black';
    gameContext.fill();
    gameContext.closePath();
}

this.upgrade = function() {
    this.power += 200;
    this.range += 200;
    this.isUpgraded = true;
    this.sellPrice += this.upgradeCost * 0.6;
    upgradeButton.style.display = "none";
}
}

function Enemy (xStart, yStart, hp, speed, image) {
    this.enemyImg = image;
    this.xPos = xStart;
    this.yPos = yStart;
    this.hp = hp;
    this.speed = speed;
    this.moneyValue = 0;
    this.walkedPath = [
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ]
    this.distanceTravelled = 0;
    this.negRate = false;

    this.redraw = function() {
        gameContext.drawImage(this.enemyImg, this.xPos, 
            this.yPos, 50, 50);
        let xGridNum = Math.floor(this.xPos / 50);
        let yGridNum = Math.floor(this.yPos / 50);
        let rate = this.speed / slowdown;

        this.distanceTravelled += rate;

        if (this.xPos % 50 != 0) {
            if (this.negRate) {
                this.xPos -= rate;
            }
            else {
                this.xPos += rate;
            }
        }
        else if (this.yPos % 50 != 0) {
            if (this.negRate) {
                this.yPos -= rate;
            }
            else {
                this.yPos += rate;
            }
        }
        else {
            if (yGridNum + 1 < 12 && mapLayout[yGridNum + 1][xGridNum] === 'O'
                && this.walkedPath[yGridNum + 1][xGridNum] === '') {
                this.walkedPath[yGridNum][xGridNum] = "walked";
            this.yPos += rate;
            if (this.negRate) {
                this.negRate = false;
            }
        }
        else if (xGridNum + 1 < 20 && mapLayout[yGridNum][xGridNum + 1] === 'O' 
            && this.walkedPath[yGridNum][xGridNum + 1] === '') {
            this.walkedPath[yGridNum][xGridNum] = "walked";
        this.xPos += rate;
        if (this.negRate) {
            this.negRate = false;
        }
    }
    else if (yGridNum - 1 >= 0 && mapLayout[yGridNum - 1][xGridNum] === 'O' 
        && this.walkedPath[yGridNum - 1][xGridNum] === '') {
        this.walkedPath[yGridNum][xGridNum] = "walked";
    this.yPos -= rate;
    if (!this.negRate) {
        this.negRate = true;
    }
}
else if (xGridNum - 1 >= 0 && mapLayout[yGridNum][xGridNum - 1] === 'O' 
    && this.walkedPath[yGridNum][xGridNum - 1] === '') {
    this.walkedPath[yGridNum][xGridNum] = "walked";
this.xPos -= rate;
if (!this.negRate) {
    this.negRate = true;
}
}
}
}
}

function initOccupiedSpots () {
    for (let i = 0; i < gameCanvas.height / 50; i++) {
        var newRow = [];
        for (let j = 0; j < gameCanvas.width / 50; j++) {
            if (mapLayout[i][j] === 'X') {
                newRow[j] = false;
            }
            else {
                newRow[j] = true;
            }

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

function randomItem() {
    if (items.length < 6) {
        if (Math.floor(Math.random() * (125-1) + 1) === 1) {
            items.push("0");
        }
        if (Math.floor(Math.random() * (50-1) + 1) === 1) {
            items.push("1");
        }
        if (Math.floor(Math.random() * (125-1) + 1) === 1) {
            items.push("2");
        }
    }
}

function useItem() {
    if (this.value === "0") {
        life += 30;
        if (life >= 100) {
            life = 100;
        }
        items.indexOf("0");
        items.splice(items.indexOf("0"), 1);
        msgArea.innerHTML = "You have healed 30 hit points";
    }
    else if (this.value === "1") {
        money += 250;
        items.splice(items.indexOf("1"), 1);
        msgArea.innerHTML = "Your money has increased by 250";
    }
    else if (this.value === "2") {
        slowdown = 2;
        setTimeout(function () {slowdown = 1}, 10000);
        items.splice(items.indexOf("2"), 1);
        msgArea.innerHTML = "Enemies have been slowed for 10 seconds";
    }
}

function updateCanvas() {
    if (waveEnd) {
        if (waveCount === 5) {
            gameOver();
        };
        startBuildPhase();
        waveEnd = false;
    }

    if (life === 0) {
        winFlag = false;
        gameOver();
    }

    buildTimer.innerHTML = "Build Timer: " + countdown;
    if (countdown > 0) {
        doneBuildButton.style.display = "inline-block";
    }
    else {
        doneBuildButton.style.display = "none";
    }

    if (doneSpawn && wave.length === 0) {
        countdown = 30;
        waveEnd = true;
        doneSpawn = false;
    }

        // Clear Canvas
        gameContext.drawImage(backgroundImg, 0, 0, gameCanvas.width, gameCanvas.height);

        // Highlight the box corresponding to the current mouse position
        gameContext.fillStyle = "rgba(255, 255, 255, 0.5)";
        gameContext.fillRect(currSquare.xPos, currSquare.yPos, 50, 50);
        
        // Home
        gameContext.fillStyle = "rgba(0, 128, 0, 0.5)";
        gameContext.fillRect(100, 550, 50, 50);

        // Spawn Spot
        gameContext.fillStyle = "rgba(255, 0, 0, 0.5)";
        gameContext.fillRect(50, 0, 50, 50);

        // drawGrid();

        // Redraw Wave
        if (true) {
            for (let i = 0; i < wave.length; i++) {
                if (wave[i].yPos < gameCanvas.height - 50) {
                    wave[i].redraw();
                }
                else {
                    wave.shift();
                    if (life > 0) {
                        life -= 10;
                    }
                }
            }
        }

        // Redraw Towers
        for (let i = 0; i < towerList.length; i++) {
            towerList[i].redraw();
        }

        // Redraw attack animations after tower so they overlap the towers
        for (let i = 0; i < towerList.length; i++) {
            towerList[i].attack();
        }

        if (clickedSquare.xPos != null) {
            gameContext.moveTo(clickedSquare.xPos, clickedSquare.yPos);
            
            gameContext.beginPath();
            gameContext.lineWidth = "3";
            gameContext.strokeStyle = "lightgreen";
            gameContext.rect(clickedSquare.xPos, clickedSquare.yPos, 50, 50);
            gameContext.stroke();
            gameContext.closePath();
        }

        refreshCount++;
        if (refreshCount === 11) {
            refreshCount = 1;
        }

        // scoreHeader.innerHTML = "Score: " + score;
        scoreHeader.value = score;
        //display Score in modal.
        $('#displayScore').val('Your Score: ' + score);
        lifeBar.value = life;
        moneyHeader.innerHTML = "Money: " + money;

        for (let i = 0; i < inventory.length; i++) {
            inventory[i].value = "";
            inventory[i].innerHTML = "";
        }

        for (let i = 0; i < items.length; i++) {
            inventory[i].value = items[i];
            inventory[i].innerHTML = items[i];
        }

        if (countdown <= 0){
            spawnWave();
            countdown = "N/A";
        }
    }

    function createTower() {
        let buildSuccess = false;
        let moneyFlag = false;

        if (!occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50]) {
            var newTower;
            if (gamePanel.tower_select.value === "1") {
                if (money >= 250) {
                    money -= 250;
                    newTower = new ArrowTower(currSquare.xPos, currSquare.yPos);
                    buildSuccess = true;
                }
                else {
                    moneyFlag = true;
                }
            }
            else if (gamePanel.tower_select.value === "2") {
                if (money >= 750) {
                    money -= 750;
                    newTower = new LaserTower(currSquare.xPos, currSquare.yPos);
                    buildSuccess = true;
                }
                else {
                    moneyFlag = true;
                }
            }
            else if (gamePanel.tower_select.value === "3") {
                if (money >= 500) {
                    money -= 500;
                    newTower = new ArtilleryTower(currSquare.xPos, currSquare.yPos);
                    buildSuccess = true;
                }
                else {
                    moneyFlag = true;
                }
            }
            else if (gamePanel.tower_select.value === "4") {
                if (money >= 350) {
                    money -= 350;
                    newTower = new CannonTower(currSquare.xPos, currSquare.yPos);
                    buildSuccess = true;
                }
                else {
                    moneyFlag = true;
                }
            }

            if (buildSuccess) {
                towerList.push(newTower);
                occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50] = newTower;
                if (!occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50].isUpgraded) {
                    upgradeButton.style.display = "inline-block";
                }
                else {
                    upgradeButton.style.display = "none";
                }
                sellButton.style.display = "inline-block";
                clickedSquare.xPos = currSquare.xPos;
                clickedSquare.yPos = currSquare.yPos;
                msgArea.innerHTML = "Tower Built";
            }
            else {
                upgradeButton.style.display = "none";
                sellButton.style.display = "none";
                msgArea.innerHTML = "Defend your Home!!!";
            }

            if (moneyFlag === true) {
                msgArea.innerHTML = "You don't have enough money";
            }
        }
        else {
            if (typeof(occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50]) === "object") {
                msgArea.innerHTML = "You cannot build here";
                if (!occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50].isUpgraded) {
                    upgradeButton.style.display = "inline-block";
                }
                else {
                    upgradeButton.style.display = "none";
                }
                sellButton.style.display = "inline-block";
                clickedSquare.xPos = currSquare.xPos;
                clickedSquare.yPos = currSquare.yPos;
            }
            else if (occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50] === true
                && gamePanel.tower_select.value !== "") {
                msgArea.innerHTML = "You cannot build here";
            upgradeButton.style.display = "none";
            sellButton.style.display = "none";
        }
        else {
            upgradeButton.style.display = "none";
            sellButton.style.display = "none";
        }
    }
}

function spawnWave () {
    clearInterval(timerInterval);
    let waveDelay = 0;
    let maxDelay = 0;

        // let newEnemy = new Enemy(50, 0, 200, 2, enemyImg);

        for (let i = 0; i < waveInfo[waveCount].length; i++) {
            waveDelay = 0;
            for (let j = 0; j < waveInfo[waveCount][i]; j++) {
                let enemyImg = new Image();
                enemyImg.src = enemyInfo[i][0];
                let newEnemy = new Enemy(50, 0, enemyInfo[i][2], enemyInfo[i][3], enemyImg);
                newEnemy.moneyValue = enemyInfo[i][4];
                setTimeout(function () {wave.push(newEnemy)}, waveDelay);
                waveDelay += enemyInfo[i][1];
            }
            if (waveDelay > maxDelay) {
                maxDelay = waveDelay + 500;
            }
        }
        
        setTimeout(function () {doneSpawn = true}, maxDelay);
        waveCount++;
    }

    function initGame () {
        updateInterval = setInterval(updateCanvas, 50);
        gameCanvas.style.display = "block";
        gamePanel.style.display = "block";
        startButton.style.display = "none";
        msgArea.innerHTML = "Defend your Home!!!";
        startBuildPhase();
    }


    function gameOver () {
        let winLoseMsg = document.getElementById('win-lose-status');
        //Makes the modal undismissable when win/lose condition met.
        //Kento's code.
        $('#submitScore').modal({
            backdrop: 'static',
            keyboard: false
        });

        if (winFlag) {
            msgArea.innerHTML = "you winner, remaining money has been added to score";
            //Displays Modal. Kento's code.
            winLoseMsg.innerHTML = 'You Win!';
            $('#submitScore').modal('show');
        }
        else {
            msgArea.innerHTML = "you donezo, remaining money has been added to score";
            //Displays Modal. Kento's code.
            winLoseMsg.innerHTML = 'You are a loser! And you lost the game.';
            $('#submitScore').modal('show');

        }
        
        // gameCanvas.style.display = "none";
        // gamePanel.style.display = "none";
        clearInterval(updateInterval);
        score += money;
        money = 0;
        submitScoreButton.style.display = "block";
        restartButton.style.display = "block";
    }

    function upgradeTower () {
        let towerToUpgrade = occupiedSpots[clickedSquare.yPos / 50][clickedSquare.xPos / 50];

        if (towerToUpgrade.upgradeCost > money) {
            msgArea.innerHTML = "You need " + towerToUpgrade.upgradeCost + " money to upgrade";
        }
        else {
            msgArea.innerHTML = "Tower Upgraded";
            towerToUpgrade.upgrade();
            money -= towerToUpgrade.upgradeCost;
        }
    }

    function sellTower () {
        let towerToRemove = occupiedSpots[clickedSquare.yPos / 50][clickedSquare.xPos / 50];
        let spliceIndex = towerList.indexOf(towerToRemove);

        money += towerToRemove.sellPrice;
        occupiedSpots[clickedSquare.yPos / 50][clickedSquare.xPos / 50] = false;
        towerList.splice(spliceIndex, 1);
    }

    function startBuildPhase() {
        countdown = 30;
        timerInterval = setInterval(function () {countdown -= 1;}, 1000);
    }

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

    for (let i = 0; i < inventory.length; i++) {
        inventory[i].onclick = useItem;
    }

    submitScoreButton.style.display = "none";
    restartButton.style.display = "none";
    upgradeButton.style.display = "none";
    upgradeButton.onclick = upgradeTower;
    sellButton.style.display = "none";
    sellButton.onclick = sellTower;
    initOccupiedSpots();
    gameCanvas.onclick = createTower;
    gameCanvas.style.display = "none";
    gamePanel.style.display = "none";
    startButton.onclick = initGame;
    doneBuildButton.onclick = function () {countdown = 0};
    restartButton.onclick = function () {location = "index.php"};
}

window.onload = pageInit;