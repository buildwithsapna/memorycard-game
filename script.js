/* =========================================
   MEMORY MAGIC
   Player Details + Difficulty + Game
========================================= */


/* ================= EMOJIS ================= */

const emojis = [
    "🐶", "🐶",
    "🐱", "🐱",
    "🦊", "🦊",
    "🐼", "🐼",
    "🐸", "🐸",
    "🦁", "🦁",
    "🐰", "🐰",
    "🐨", "🐨"
];


/* ================= HTML ELEMENTS ================= */

const playerScreen =
    document.getElementById("player-screen");

const difficultyScreen =
    document.getElementById("difficulty-screen");

const gameScreen =
    document.getElementById("game-screen");

const winScreen =
    document.getElementById("win-screen");

const gameOverScreen =
    document.getElementById("game-over-screen");


const playerNameInput =
    document.getElementById("player-name");

const playerAgeInput =
    document.getElementById("player-age");

const nameError =
    document.getElementById("name-error");

const ageError =
    document.getElementById("age-error");


const continueButton =
    document.getElementById("continue-btn");

const welcomeName =
    document.getElementById("welcome-name");


const easyButton =
    document.getElementById("easy-btn");

const mediumButton =
    document.getElementById("medium-btn");

const hardButton =
    document.getElementById("hard-btn");

const backButton =
    document.getElementById("back-btn");


const restartButton =
    document.getElementById("restart-btn");

const nextLevelButton =
    document.getElementById("next-level-btn");

const playAgainButton =
    document.getElementById("play-again-btn");

const tryAgainButton =
    document.getElementById("try-again-btn");

const changeDifficultyButton =
    document.getElementById("change-difficulty-btn");


const gameBoard =
    document.getElementById("game-board");


const timerDisplay =
    document.getElementById("timer");

const movesDisplay =
    document.getElementById("moves");

const maxMovesDisplay =
    document.getElementById("max-moves");

const matchesDisplay =
    document.getElementById("matches");


const difficultyLabel =
    document.getElementById("difficulty-label");


const gamePlayerName =
    document.getElementById("game-player-name");

const winPlayerName =
    document.getElementById("win-player-name");


const finalTime =
    document.getElementById("final-time");

const finalMoves =
    document.getElementById("final-moves");


const gameOverMessage =
    document.getElementById("game-over-message");

const overTime =
    document.getElementById("over-time");

const overMoves =
    document.getElementById("over-moves");

const overMatches =
    document.getElementById("over-matches");

const winTitle =
    document.getElementById("win-title");


/* ================= GAME VARIABLES ================= */

let playerName = "";

let playerAge = "";

let currentDifficulty = "easy";

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let gameActive = false;

let moves = 0;

let matches = 0;

let seconds = 0;

let timeLimit = 120;

let maxMoves = 40;

let timerInterval = null;


/* ================= DIFFICULTY SETTINGS ================= */

const difficultySettings = {

    easy: {
        name: "Easy",
        time: 120,
        moves: 40
    },

    medium: {
        name: "Medium",
        time: 60,
        moves: 30
    },

    hard: {
        name: "Hard",
        time: 30,
        moves: 20
    }

};


/* ================= PLAYER DETAILS ================= */

continueButton.addEventListener(
    "click",
    function () {

        const name =
            playerNameInput.value.trim();

        const age =
            playerAgeInput.value.trim();


        nameError.textContent = "";

        ageError.textContent = "";


        let valid = true;


        if (name === "") {

            nameError.textContent =
                "Please enter your name.";

            valid = false;
        }


        if (age === "") {

            ageError.textContent =
                "Please enter your age.";

            valid = false;

        } else if (
            Number(age) < 5 ||
            Number(age) > 100
        ) {

            ageError.textContent =
                "Age must be between 5 and 100.";

            valid = false;
        }


        if (!valid) {
            return;
        }


        playerName = name;

        playerAge = age;


        welcomeName.textContent =
            playerName;


        playerScreen.classList.add(
            "hidden"
        );

        difficultyScreen.classList.remove(
            "hidden"
        );

    }
);


/* ================= BACK BUTTON ================= */

backButton.addEventListener(
    "click",
    function () {

        difficultyScreen.classList.add(
            "hidden"
        );

        playerScreen.classList.remove(
            "hidden"
        );

    }
);


/* ================= SHUFFLE ================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[randomIndex]
        ] =
        [
            array[randomIndex],
            array[i]
        ];

    }

}


/* ================= CREATE GAME ================= */

function createGame() {

    gameBoard.innerHTML = "";


    const cards = [...emojis];

    shuffle(cards);


    cards.forEach(
        function (emoji) {

            const card =
                document.createElement("div");


            card.classList.add("card");


            card.dataset.emoji =
                emoji;


            card.innerHTML = `

                <div class="card-inner">

                    <div class="card-front">
                        ?
                    </div>

                    <div class="card-back">
                        ${emoji}
                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                flipCard
            );


            gameBoard.appendChild(card);

        }
    );

}


/* ================= START GAME ================= */

function startGame(level) {

    currentDifficulty = level;


    const settings =
        difficultySettings[level];


    timeLimit =
        settings.time;


    maxMoves =
        settings.moves;


    moves = 0;

    matches = 0;

    seconds = timeLimit;


    firstCard = null;

    secondCard = null;

    lockBoard = false;

    gameActive = true;


    movesDisplay.textContent = "0";

    matchesDisplay.textContent = "0";

    maxMovesDisplay.textContent =
        maxMoves;


    difficultyLabel.textContent =
        settings.name;


    gamePlayerName.textContent =
        playerName;


    updateTimer();


    timerDisplay.classList.remove(
        "timer-warning"
    );


    createGame();


    difficultyScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    startTimer();

}


/* ================= TIMER ================= */

function startTimer() {

    stopTimer();


    timerInterval =
        setInterval(
            function () {

                if (!gameActive) {
                    return;
                }


                seconds--;


                updateTimer();


                if (seconds <= 10) {

                    timerDisplay.classList.add(
                        "timer-warning"
                    );

                }


                if (seconds <= 0) {

                    gameOver(
                        "⏰ Time's Up!"
                    );

                }

            },
            1000
        );

}


/* ================= STOP TIMER ================= */

function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


/* ================= UPDATE TIMER ================= */

function updateTimer() {

    const minutes =
        Math.floor(seconds / 60);


    const remainingSeconds =
        seconds % 60;


    timerDisplay.textContent =
        String(minutes).padStart(2, "0")
        + ":"
        + String(
            remainingSeconds
        ).padStart(2, "0");

}


/* ================= FLIP CARD ================= */

function flipCard() {

    if (!gameActive) {
        return;
    }


    if (lockBoard) {
        return;
    }


    if (this === firstCard) {
        return;
    }


    if (
        this.classList.contains("matched")
    ) {
        return;
    }


    this.classList.add(
        "flipped"
    );


    if (firstCard === null) {

        firstCard = this;

        return;
    }


    secondCard = this;


    moves++;


    movesDisplay.textContent =
        moves;


    checkMatch();

}


/* ================= CHECK MATCH ================= */

function checkMatch() {

    const isMatch =
        firstCard.dataset.emoji ===
        secondCard.dataset.emoji;


    if (isMatch) {

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );


        matches++;


        matchesDisplay.textContent =
            matches;


        resetCards();


        /* ALL 8 PAIRS MATCHED */

        if (matches === 8) {

            gameActive = false;

            stopTimer();


            setTimeout(
                showWinScreen,
                500
            );


            return;
        }


        /* MOVE LIMIT */

        if (moves >= maxMoves) {

            gameOver(
                "🚫 Move Limit Reached!"
            );

        }


    } else {

        lockBoard = true;


        setTimeout(
            function () {

                if (!gameActive) {
                    return;
                }


                firstCard.classList.remove(
                    "flipped"
                );

                secondCard.classList.remove(
                    "flipped"
                );


                resetCards();


                if (moves >= maxMoves) {

                    gameOver(
                        "🚫 Move Limit Reached!"
                    );

                }

            },
            800
        );

    }

}


/* ================= RESET CARDS ================= */

function resetCards() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* ================= WIN SCREEN ================= */

function showWinScreen() {

    winPlayerName.textContent =
        playerName;


    finalTime.textContent =
        timerDisplay.textContent;


    finalMoves.textContent =
        moves;


    /* HARD COMPLETE */

    if (currentDifficulty === "hard") {

        winTitle.textContent =
            "All Levels Completed! 🎉";

        nextLevelButton.textContent =
            "Play Easy Again →";

    }

    /* EASY / MEDIUM */

    else {

        winTitle.textContent =
            "Congratulations!";

        nextLevelButton.textContent =
            "Next Level →";

    }


    gameScreen.classList.add(
        "hidden"
    );


    winScreen.classList.remove(
        "hidden"
    );

}


/* ================= NEXT LEVEL ================= */

function nextLevel() {

    if (currentDifficulty === "easy") {

        startGame("medium");

    }

    else if (
        currentDifficulty === "medium"
    ) {

        startGame("hard");

    }

    else {

        /* After Hard → Easy */

        startGame("easy");

    }

}


/* ================= NEXT LEVEL BUTTON ================= */

nextLevelButton.addEventListener(
    "click",
    function () {

        nextLevel();

    }
);


/* ================= PLAY AGAIN ================= */

playAgainButton.addEventListener(
    "click",
    function () {

        startGame(
            currentDifficulty
        );

    }
);


/* ================= GAME OVER ================= */

function gameOver(message) {

    if (!gameActive) {
        return;
    }


    gameActive = false;

    lockBoard = true;


    stopTimer();


    if (seconds < 0) {
        seconds = 0;
    }


    updateTimer();


    gameOverMessage.textContent =
        message;


    overTime.textContent =
        timerDisplay.textContent;


    overMoves.textContent =
        moves;


    overMatches.textContent =
        matches + "/8";


    gameScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* ================= TRY AGAIN ================= */

tryAgainButton.addEventListener(
    "click",
    function () {

        startGame(
            currentDifficulty
        );

    }
);


/* ================= CHANGE DIFFICULTY ================= */

function showDifficultyScreen() {

    stopTimer();


    gameActive = false;

    lockBoard = true;


    gameScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    difficultyScreen.classList.remove(
        "hidden"
    );

}


changeDifficultyButton.addEventListener(
    "click",
    function () {

        showDifficultyScreen();

    }
);


/* ================= RESTART ================= */

restartButton.addEventListener(
    "click",
    function () {

        startGame(
            currentDifficulty
        );

    }
);


/* ================= DIFFICULTY BUTTONS ================= */

easyButton.addEventListener(
    "click",
    function () {

        startGame("easy");

    }
);


mediumButton.addEventListener(
    "click",
    function () {

        startGame("medium");

    }
);


hardButton.addEventListener(
    "click",
    function () {

        startGame("hard");

    }
);