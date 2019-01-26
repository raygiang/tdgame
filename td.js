function pageInit() {
    var testDiv = document.getElementById("test");

    const gameCanvas = document.getElementById("game-canvas");
    const gameContext = gameCanvas.getContext("2d");
    const gamePanel = document.forms.game_panel;
    const scoreHeader = document.getElementById("score");
    const lifeBar = document.getElementById("life");
    const moneyHeader = document.getElementById("money");
    const upgradeButton = document.getElementById("upgrade");
    const startButton = document.getElementById("start-button");

    var towerList = [];
    var occupiedSpots = [];
    var wave = [];
    var items = [];
    
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
            this.power += 2;
            this.range += 200;
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

        this.redraw = function() {
            gameContext.save();
            gameContext.translate(this.xStart + 25, this.yStart + 25);
            gameContext.rotate(this.angle + Math.PI / 2);
            gameContext.drawImage(this.artilleryTowerImage, -25, -25, 50, 50);
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
    }

    function Enemy(xStart, yStart, hp, speed, image) {
        this.enemyImg = image;
        this.xPos = xStart;
        this.yPos = yStart;
        this.hp = hp;
        this.speed = speed;
        this.moneyValue = 50;

        this.redraw = function() {
            gameContext.drawImage(this.enemyImg, this.xPos + 10, 
                this.yPos, 30, 30);
            this.yPos += speed / slowdown;
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

    function randomItem() {
        if (items.length < 5) {
            if (Math.floor(Math.random() * (75-1) + 1) === 1) {
                items.push("0");
                console.log(items);
            }
            if (Math.floor(Math.random() * (50-1) + 1) === 1) {
                items.push("1");
                console.log(items);
            }
            if (Math.floor(Math.random() * (125-1) + 1) === 1) {
                items.push("2");
                console.log(items);
            }
        }
    }

    function useItem(itemNum) {
        if (itemNum === "0") {
            life += 30;
            if (life > 100) {
                life = 100;
            }
        }
        else if (itemNum === "1") {
            money += 100;
        }
        else{
            slowdown = 2;
            setTimeout(function () {slowdown = 1}, 10000);
        }
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

        // drawGrid();

        // Redraw Wave
        if (true) {
            for (let i = 0; i < wave.length; i++) {
                if (wave[i].yPos < gameCanvas.height - 50) {
                    wave[i].redraw();
                }
                else {
                    wave.shift();
                    life -= 10;
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
            gameContext.lineWidth = "5";
            gameContext.strokeStyle = "lightgreen";
            gameContext.rect(clickedSquare.xPos, clickedSquare.yPos, 50, 50);
            gameContext.stroke();
            gameContext.closePath();
        }

        refreshCount++;
        if (refreshCount === 11) {
            refreshCount = 1;
        }

        scoreHeader.innerHTML = "Score: " + score;
        lifeBar.value = life;
        moneyHeader.innerHTML = "Money: " + money;
    }

    function createTower() {
        let buildSuccess = false;
        if (!occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50]) {
            var newTower;
            if (gamePanel.tower_select.value === "1" && money >= 50) {
                money -= 50;
                newTower = new ArrowTower(currSquare.xPos, currSquare.yPos);
                buildSuccess = true;
            }
            else if (gamePanel.tower_select.value === "2" && money >= 750) {
                money -= 750;
                newTower = new LaserTower(currSquare.xPos, currSquare.yPos);
                buildSuccess = true;
            }
            else if (gamePanel.tower_select.value === "3" && money >= 500) {
                money -= 500;
                newTower = new ArtilleryTower(currSquare.xPos, currSquare.yPos);
                buildSuccess = true;
            }
            else if (gamePanel.tower_select.value === "4" && money >= 250) {
                money -= 250;
                newTower = new CannonTower(currSquare.xPos, currSquare.yPos);
                buildSuccess = true;
            }
            if (buildSuccess) {
                towerList.push(newTower);
                occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50] = newTower;
                upgradeButton.style.display = "inline-block";
                clickedSquare.xPos = currSquare.xPos;
                clickedSquare.yPos = currSquare.yPos;
            }
            else {
                upgradeButton.style.display = "none";
            }
        }
        else {
            if (typeof(occupiedSpots[currSquare.yPos / 50][currSquare.xPos / 50]) === "object") {
                upgradeButton.style.display = "inline-block";
                clickedSquare.xPos = currSquare.xPos;
                clickedSquare.yPos = currSquare.yPos;
            }
            else {
                upgradeButton.style.display = "none";
            }
        }
    }

    function spawnWave() {
        var waveDelay = 0;
        var enemyImg = new Image();
        enemyImg.src = "images/lolface2.png";

        for (let i = 0; i < 2000 ; i++) {
            setTimeout(function () {
                wave.push(new Enemy(300, 0, 300, 5, enemyImg));
            }, waveDelay);
            waveDelay += 500;
        }
    }

    function initGame () {
        var updateInterval = setInterval(updateCanvas, 50);
        gameCanvas.style.display = "block";
        gamePanel.style.display = "block";
        startButton.style.display = "none";
        spawnWave();
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

    function startRound() {
        let buildPhaseTimer = 60;
        
        setTimeout(spawnWave, 1000);
    }

    upgradeButton.style.display = "none";
    initOccupiedSpots();
    gameCanvas.onclick = createTower;
    gameCanvas.style.display = "none";
    gamePanel.style.display = "none";
    startButton.onclick = initGame;
}

window.onload = pageInit;