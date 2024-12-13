
// Player variables
let players = [];
const maxPlayers = 4;
let currentPlayerIndex = 0;

// Quiz variables
let selectedQuizType = null;
let questionsPerPlayer = 3;
let currentScreen = 'welcome-screen';
let currentQuestion = 0;
let selectedAnswerIndex = null;

// Timer variables
let timer = null;
let timeLeft = 30;
let isTimerRunning = false;

// Score 
let scores = {};
const POINTS_CORRECT = 10;

// DOM elements
let playerInput;
let addButton;
let playersList;
let startButton;
let errorMessage;
let prevButton;

// Questions object
const questions = {
    html: [
        {
            question: " What is <img> tag used for?",
            answers: [
                "A paragraph",
                "An imaginary number",
                "An image",
                "A list",
            ],
            correctIndex: 2
        },
        {
            question: "What tag name is used for a paragraph?",
            answers: [
                "<paragraph>",
                "<p>",
                "<para>",
                "<text>"
            ],
            correctIndex: 1
        },
        {
            question: "Which tag is used for the largest title ?",
            answers: [
                "<head>",
                "<h6>",
                "<heading>",
                "<h1>"
            ],
            correctIndex: 3
        },
        {
            question: "Which of the following is the correct syntax to define a hyperlink?",
            answers:[
                "<link='url'> link text </link>",
                "<a href='url'>link text</a>",
                "<a='url'> link text </a> ",
                "<a href='url'>link text</a href>",
            ],
            correctIndex: 1
        },
        {
            question: "What is generally the first line of a html?",
            answers:[
                "<!DOCTYPE html>",
                "<html>",
                "<header>",
                "<body>",
            ],
            correctIndex: 0
        }
    ],
    css: [
        {
            question: "What does CSS stand for ?",
            answers: [
                "Computer Style Sheets",
                "Cascading Style Sheets",
                "Creative Style System",
                "Colorful Style Sheets"
            ],
            correctIndex: 1
        },
        {
            question: "With which of the following do we change the background color?",
            answers: [
                "background-color",
                "bgcolor",
                "color",
                "background"
            ],
            correctIndex: 0
        },
        {
            question: "With which of the following do we change the font size ?",
            answers: [
                "text-size",
                "font-size",
                "text-style",
                "font size"
            ],
            correctIndex: 1
        },
        {
            question: "Which of the following is not part of CSS?",
            answers:[
                "Margin",
                "Padding",
                "Border",
                "Alignment"
            ],
            correctIndex: 3
        },
        {
            question: "Which property is used to make the text bold in CSS?",
            answers:[
                "font-style",
                "font-weight",
                "text-decoration",
                "text-transform"
            ],
            correctIndex: 1
        }
    ],
    javascript: [
        {
            question: "How do we declare a non constant variable ?",
            answers: [
                "var x = 5",
                "let x = 5",
                "variable x = 5",
                "int x = 5"
            ],
            correctIndex: 1
        },
        {
            question: "What does console.log() do ?",
            answers: [
                "Deletes what is in the brackets",
                "Creates an error",
                "Displays the content in the brackets",
                "Saves the data",
            ],
            correctIndex: 2
        },
        {
            question: "How do we create a function?",
            answers: [
                "function:myFunction()",
                "function = myFunction()",
                "function myFunction()",
                "new function()"
            ],
            correctIndex: 2
        },
        {
            question : "Which of the following is not a JavaScript data type?",
            answers:[
                "Boolean",
                "Undefined",
                "Number",
                "Character"
            ],
            correctIndex: 3
        },
        {
            question: "What is the correct way to write an array in JavaScript?",
            answers:[
                "let colors = 'red', 'green', 'blue';",
                "let colors = ['red', 'green', 'blue'];",
                "let colors = (1:'red', 2:'green', 3:'blue');",
                "let colors = {'red', 'green', 'blue'};"
            ],
            correctIndex: 1
        }
    ],
    mixed: [
        {
            question: "Which language generates some style or design on a web page?",
            answers: [
                "HTML",
                "CSS",
                "JavaScript",
                "PHP"
            ],
            correctIndex: 1
        },
        {
            question: "What is generally the first line of a html?",
            answers:[
                "<!DOCTYPE html>",
                "<html>",
                "<header>",
                "<body>",
            ],
            correctIndex: 0
        },
        {
            question: "What does console.log() do ?",
            answers: [
                "Deletes what is in the brackets",
                "Creates an error",
                "Displays the content in the brackets",
                "Saves the data",
            ],
            correctIndex: 2
        },
        {
            question: "Which extension is related to JavaScript ?",
            answers: [
                ".html",
                ".css",
                ".php",
                ".js"
            ],  
            correctIndex: 3
        },
        {
            question: "With which of the following do we change the font size ?",
            answers: [
                "text-size",
                "font-size",
                "text-style",
                "font size"
            ],
            correctIndex: 1
        },
    ]
};



// Main function 

document.addEventListener('DOMContentLoaded', function() {

    playerInput = document.getElementById('playerNameInput');
    addButton = document.getElementById('addPlayerBtn');
    playersList = document.getElementById('playersList');
    startButton = document.getElementById('startGameBtn');
    errorMessage = document.getElementById('errorMessage');
    prevButton = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    addButton.addEventListener('click', addPlayer);
    playerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
   
    // Navigation
    startButton.addEventListener('click', () => showScreen('quiz-selection-screen'));
    prevButton.addEventListener('click', () => showScreen('welcome-screen'));

    // Quiz selection
    document.querySelectorAll('.quiz-type-btn').forEach(button => {
        button.addEventListener('click', () => selectQuizType(button.dataset.type));
    });

    // Difficulty level selection
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', () => selectDifficulty(button.dataset.questions));
    });

    // Game launcher
    nextBtn.addEventListener('click', () => {
        if (selectedQuizType && players.length > 0) {
            startGame();
        } else {
            showError("Sélectionnez un type de quiz et ajoutez des joueurs");
        }
    });

    // Return to initial page
    showScreen('welcome-screen');
});


// ---- Player functions management ----

function addPlayer() {
    const playerName = playerInput.value.trim();

    // Validation
    if(playerName === "") {
        showError("The name of the player cannot be empty");
        return;
    }

    if(players.includes(playerName)) {
        showError("This name has already been taken");
        return;
    }

    if(players.length >= maxPlayers) {
        showError("Maximum " + maxPlayers + "authorized players");
        return;
    }

    // Add a player
    players.push(playerName);
    displayPlayers();
   
    // Reinitialize 
    playerInput.value = "";
    errorMessage.textContent = "";
}

function removePlayer(index) {
    players.splice(index, 1);
    displayPlayers();
    updateButtons();
}

function displayPlayers() {
    playersList.innerHTML = '';

    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        playerDiv.style.borderLeft = "4px solid var(--player" + index + 1 + "-color)";

        const nameSpan = document.createElement('span');
        nameSpan.textContent = player;
        playerDiv.appendChild(nameSpan);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'player-delete';
        deleteButton.textContent = '×';
        deleteButton.onclick = () => removePlayer(index);
        playerDiv.appendChild(deleteButton);

        playersList.appendChild(playerDiv);
    });

    updateButtons();
}

function updateButtons() {
    // Starting button
    startButton.disabled = players.length === 0;
   
    // Maximum number of players
    const isMaxPlayers = players.length >= maxPlayers;
    addButton.disabled = isMaxPlayers;
    playerInput.disabled = isMaxPlayers;
   
    if (isMaxPlayers) {
        addButton.classList.add('disabled');
        playerInput.classList.add('disabled');
    } else {
        addButton.classList.remove('disabled');
        playerInput.classList.remove('disabled');
    }
}

// ---- Quiz management ----

function startGame() {
    // Filter the questions for the selected quiz type and difficulty level
    questions[selectedQuizType] = questions[selectedQuizType].slice(0, questionsPerPlayer * players.length);

    // Initializing variables for the game
    currentPlayerIndex = 0;
    currentQuestion = 0;
    initializeScores();

    // Initial features
    showScreen('game-screen');
    displayQuestion();
    displayCurrentPlayer();
    setupGameButtons();
    startTimer();
}

function selectQuizType(type) {
    selectedQuizType = type;
   
    document.querySelectorAll('.quiz-type-btn').forEach(button => {
        button.classList.toggle('selected', button.dataset.type === type);
    });

    updateQuizSelectionScreen();
}

function selectDifficulty(count) {

    questionsPerPlayer = parseInt(count);
   
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.classList.toggle('selected',
            parseInt(button.dataset.questions) === questionsPerPlayer);
    });
}

function displayQuestion() {

    const questionData = questions[selectedQuizType][currentQuestion];
   
    // Showing the question on screen
    document.getElementById('question-text').textContent = questionData.question;
   
    // Showing the answers on screen
    const answerButtons = document.querySelectorAll('.answer-btn');
    questionData.answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer;
    });

    // Reinitialize
    selectedAnswerIndex = null;
    const submitButton = document.getElementById('submit-btn');
    if(submitButton) {
        submitButton.disabled = true;
    }
}

// ---- Navigation ----

function showScreen(screenId) {
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
   
    // Show the demanded screen
    const screenToShow = document.getElementById(screenId);
    if(screenToShow) {
        screenToShow.style.display = 'block';
        currentScreen = screenId;
    }
   
    // Reinitialize when we come back to first screen
    if (screenId === 'welcome-screen') {
        selectedQuizType = null;
        questionsPerPlayer = 3;
        document.querySelectorAll('.quiz-type-btn, .difficulty-btn')
            .forEach(btn => btn.classList.remove('selected'));
    }
   
    // Updates
    updateButtons();
    if (screenId === 'quiz-selection-screen') {
        updateQuizSelectionScreen();
    }
}

function updateQuizSelectionScreen() {

    const nextBtn = document.getElementById('nextBtn');
    if(nextBtn) {
        nextBtn.disabled = !selectedQuizType;
    }

}

function nextQuestion() {

    // Moving to next player
    currentPlayerIndex++;
   
    // If all players have played
    if(currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
        currentQuestion++;
    }
   
    // Checking if the quiz is finished
    if(currentQuestion >= questions[selectedQuizType].length) {
        endGame();
        return;
    }
   
    // Prepare next question
    displayQuestion();
    displayCurrentPlayer();
    resetAnswerButtons();
    startTimer();
}


// ---- Timer management ----

function startTimer() {
    
    // Timer initialization
    timeLeft = 30;
    isTimerRunning = true;
   
    // Catching the timer's display
    const timerDisplay = document.getElementById('timer');
   
    // Stop the previous timer if still running
    if(timer !== null) {
        clearInterval(timer);
    }
   
    // Start the new timer

    timer = setInterval(function() {
        
        //Describing timer
        timeLeft--;
       
        // Update the display
        if(timerDisplay) {
            timerDisplay.textContent = timeLeft;
           
            // Alert when 10 seconds are left 
            if(timeLeft <= 10) {
                timerDisplay.style.color = 'red';
            }
        }
       
        // If time is up
        if(timeLeft <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    
    // Stop the timer
    clearInterval(timer);
    isTimerRunning = false;
   
    // Desactivate the buttons
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.disabled = true;
    });
   
    // Message if the player has run out of time
    showMessage("Time has run out !", "error");
   
    // Go on to next question
    setTimeout(nextQuestion, 2000);
}

// ---- Answers management ----

function setupGameButtons() {

    // Answer buttons configuration
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.addEventListener('click', handleAnswerClick);
    });

    // Validation buttons configuration
    const submitButton = document.getElementById('submit-btn');
    if(submitButton) {
        submitButton.addEventListener('click', validateAnswer);
    }

}

function handleAnswerClick(event) {

    // Undo previous selected answer
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Take into account new selected answer
    event.target.classList.add('selected');
    selectedAnswerIndex = parseInt(event.target.dataset.index);

    // Activate Submition button
    const submitButton = document.getElementById('submit-btn');
    if(submitButton) {
        submitButton.disabled = false;
    }

}

function validateAnswer() {
    // Stop the timer
    clearInterval(timer);

    // Check the answer
    const questionData = questions[selectedQuizType][currentQuestion];
    const isCorrect = selectedAnswerIndex === questionData.correctIndex;

    // Increase score if correct
    if (isCorrect) {
        scores[players[currentPlayerIndex]] += POINTS_CORRECT;
        showMessage("Good answer! +10 points", "success");
    } else {
        showMessage("Incorrect answer!", "error");
    }

    // Increment the question counter for the current player
    playerQuestionCounters[players[currentPlayerIndex]]++;

    // Show the correct answer
    showAnswerResult(isCorrect);

    // Update the score
    updateScoreDisplay();

    // Move on to next question after 2 seconds
    setTimeout(nextQuestion, 2000);
}

function showAnswerResult(isCorrect) {

    const buttons = document.querySelectorAll('.answer-btn');
    const correctButton = buttons[questions[selectedQuizType][currentQuestion].correctIndex];
    const selectedButton = buttons[selectedAnswerIndex];

    if(isCorrect) {
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('wrong');
        correctButton.classList.add('correct');
    }
}


// ---- Score's management ----

let playerQuestionCounters = {};

function initializeScores() {
    scores = {};
    playerQuestionCounters = {};
    players.forEach(player => {
        scores[player] = 0;
        playerQuestionCounters[player] = 0; // Initialize question counter for each player
    });
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('current-score');
    const currentPlayer = players[currentPlayerIndex];
   
    if(scoreDisplay && scores[currentPlayer] !== undefined) {
        scoreDisplay.textContent = scores[currentPlayer];
    }
}

function displayCurrentPlayer() {
    const playerNameSpan = document.querySelector('.player-name');
    const currentPlayer = players[currentPlayerIndex];
   
    if (playerNameSpan && currentPlayer) {
        playerNameSpan.textContent = currentPlayer;
        playerNameSpan.style.color = `var(--player${currentPlayerIndex + 1}-color)`;
    }
}


function showError(message) {
    errorMessage.textContent = message;
    setTimeout(() => {
        errorMessage.textContent = '';
    }, 3000);
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if(messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 2000);
    }
}

function resetAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.classList.remove('selected', 'correct', 'wrong');
        button.disabled = false;
    });
   
    const submitButton = document.getElementById('submit-btn');
    if(submitButton) {
        submitButton.disabled = true;
    }
}

function endGame() {

    //Stop the timer
    clearInterval(timer);
   
    // Find the winner
    let maxScore = Math.max(...Object.values(scores));
    let winners = Object.entries(scores)
        .filter(([_, score]) => score === maxScore)
        .map(([name, _]) => name);
   
    // Show the winner
    let message = winners.length > 1
        ? "It is a draw between " + winners.join(' and ') + " !"
        : "" + winners[0] + " wins !";
   
    alert(message);
   
    // The quiz is finished => Go back to first screen
    showScreen('welcome-screen');
    location.reload();

}