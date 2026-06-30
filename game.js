// Grab HTML UI Components securely 
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menuOverlay = document.getElementById("menu-overlay");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

// Global Configuration Pools
const dictionary = ["galaxy", "rocket", "plasma", "meteor", "nebula", "quantum", "gravity", "shuttle", "comet", "asteroid", "eclipse", "stellar", "universe", "orbit", "horizon", "pulsar", "cosmos"];
let enemies = [];
let lasers = [];
let score = 0;
let gameOver = false;
let gameStarted = false;

// Configurable Rules via Menu
let enemySpawnInterval = 2000; 
let baseFallSpeed = 0.5;
let lastSpawnTime = 0;
let activeEnemy = null; // Typing Lock tracker 

// Static Player Vector Placement
const ship = { x: 300, y: 750 };

// Enemy Factory Prototype Engine
class Enemy {
    constructor() {
        this.word = dictionary[Math.floor(Math.random() * dictionary.length)];
        this.typedText = "";
        this.remainingText = this.word;
        this.x = Math.random() * (canvas.width - 160) + 80;
        this.y = -30;
        this.speed = Math.random() * 0.3 + baseFallSpeed;
    }

    update() {
        this.y += this.speed;
        if (this.y > ship.y - 15) {
            gameOver = true;
        }
    }

    draw() {
        ctx.font = "bold 18px 'Courier New'";
        ctx.textAlign = "center";
        let textWidth = ctx.measureText(this.word).width;
        let leftEdge = this.x - textWidth / 2;

        // Render string color separation safely
        ctx.fillStyle = "#00ffcc";
        ctx.fillText(this.typedText, leftEdge + ctx.measureText(this.typedText).width / 2, this.y);

        ctx.fillStyle = "#ffffff";
        let typedOffset = ctx.measureText(this.typedText).width;
        ctx.fillText(this.remainingText, leftEdge + typedOffset + ctx.measureText(this.remainingText).width / 2, this.y);

        // Selection boundary bounding frames
        ctx.strokeStyle = (this === activeEnemy) ? "#00ffcc" : "#2d3142";
        ctx.lineWidth = 1;
        ctx.strokeRect(leftEdge - 10, this.y - 20, textWidth + 20, 28);
    }
}

// Projectile Tracking Class Engine
class Laser {
    constructor(tx, ty) {
        this.x = ship.x;
        this.y = ship.y - 15;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.speed = 18;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 0.4, this.y - this.vy * 0.4);
        ctx.stroke();
    }
}

// Start Game Loop Parameters by specific Mode
function initializeGame(difficulty) {
    if (difficulty === "easy") {
        enemySpawnInterval = 2500;
        baseFallSpeed = 0.4;
    } else if (difficulty === "medium") {
        enemySpawnInterval = 1800;
        baseFallSpeed = 0.6;
    } else if (difficulty === "hard") {
        enemySpawnInterval = 1200;
        baseFallSpeed = 0.9;
    }

    // Clear and toggle HUD states
    menuOverlay.style.display = "none";
    score = 0;
    enemies = [];
    lasers = [];
    gameOver = false;
    gameStarted = true;

    // Direct performance animation baseline passing function pointers cleanly
    requestAnimationFrame((timestamp) => {
        lastSpawnTime = timestamp;
        gameRenderLoop(timestamp);
    });
}

// Global Core Key Detection Logic
window.addEventListener("keydown", (e) => {
    if (!gameStarted || gameOver) return;

    let key = e.key.toLowerCase();
    if (key.length !== 1) return; // Drop administrative controls keys

    if (activeEnemy) {
        // Evaluate subsequent inputs against target chains
        if (activeEnemy.remainingText.startsWith(key)) {
            activeEnemy.typedText += key;
            activeEnemy.remainingText = activeEnemy.remainingText.substring(1);
            lasers.push(new Laser(activeEnemy.x, activeEnemy.y));

            if (activeEnemy.remainingText.length === 0) {
                enemies = enemies.filter(item => item !== activeEnemy);
                activeEnemy = null;
                score += 10;
            }
        }
    } else {
        // Sweep area for matching threat strings
        let matches = enemies.filter(item => item.word.startsWith(key));
        if (matches.length > 0) {
            // Priority target: nearest matching object down screen
            matches.sort((a, b) => b.y - a.y);
            activeEnemy = matches[0];

            activeEnemy.typedText = key;
            activeEnemy.remainingText = activeEnemy.remainingText.substring(1);
            lasers.push(new Laser(activeEnemy.x, activeEnemy.y));

            if (activeEnemy.remainingText.length === 0) {
                enemies = enemies.filter(item => item !== activeEnemy);
                activeEnemy = null;
                score += 10;
            }
        }
    }
});

// Central Core Processing Loop Render Frame Pipeline
function gameRenderLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Safe procedural spawner implementation logic (No string evaluation)
        if (timestamp - lastSpawnTime > enemySpawnInterval) {
            enemies.push(new Enemy());
            lastSpawnTime = timestamp;
            if (enemySpawnInterval > 700) enemySpawnInterval -= 15; // Scaled acceleration
        }

        // Loop array modifications inside logic tracking bounds cleanly
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].update();
            lasers[i].draw();
            if (lasers[i].y < 0 || lasers[i].x < 0 || lasers[i].x > canvas.width) {
                lasers.splice(i, 1);
            }
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            enemies[i].draw();
        }

        // Space Fighter Graphics Construction
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - 15);
        ctx.lineTo(ship.x - 15, ship.y + 15);
        ctx.lineTo(ship.x + 15, ship.y + 15);
        ctx.closePath();
        ctx.fill();

        // Canvas HUD UI rendering parameters
        ctx.fillStyle = "#4b5563";
        ctx.font = "16px 'Courier New'";
        ctx.textAlign = "left";
        ctx.fillText(`SCORE: ${score}`, 25, 35);

        requestAnimationFrame(gameRenderLoop);
    } else {
        // Game Over Rendering Logic Interception Block
        ctx.fillStyle = "rgba(13, 14, 21, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 36px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px 'Courier New'";
        ctx.fillText(`Final Clean Score: ${score}`, canvas.width / 2, canvas.height / 2 + 25);
        
        // Show reset helper state text frame elements directly
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#6b7280";
        ctx.fillText("Refresh browser page to play again", canvas.width / 2, canvas.height / 2 + 75);
    }
}

// Bind event listeners correctly to prevent CSP blocks
easyBtn.addEventListener("click", () => initializeGame("easy"));
mediumBtn.addEventListener("click", () => initializeGame("medium"));
hardBtn.addEventListener("click", () => initializeGame("hard"));
