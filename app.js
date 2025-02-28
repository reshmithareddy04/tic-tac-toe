document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".box");
    const resetBtn = document.querySelector("#reset-btn");
    const newGameBtn = document.querySelector("#new-btn");
    const aiToggleBtn = document.querySelector("#ai-toggle");
    const msgContainer = document.querySelector(".msg-container");
    const msg = document.querySelector("#msg");
    const scoreX = document.querySelector("#score-x");
    const scoreO = document.querySelector("#score-o");
    const scoreDraw = document.querySelector("#score-draw");

    let turnO = true; // O starts first
    let count = 0; // Move count
    let aiEnabled = false;
    let scores = { X: 0, O: 0, Draw: 0 };

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Toggle AI Mode
    aiToggleBtn.addEventListener("click", () => {
        aiEnabled = !aiEnabled;
        aiToggleBtn.innerText = aiEnabled ? "AI: ON" : "AI: OFF";
        resetGame();
    });

    // Reset Game Board (Keeps Scores)
    const resetGameBoard = () => {
        turnO = true;  // O starts again
        count = 0;
        boxes.forEach(box => {
            box.innerText = "";
            box.classList.remove("winner");
            box.style.backgroundColor = "#ffffff"; // Reset box color
            box.disabled = false;
        });
        msgContainer.classList.add("hide");
        randomBackground();
    };

    // Full Reset (Resets Scores & Board)
    const fullReset = () => {
        scores = { X: 0, O: 0, Draw: 0 };
        updateScoreboard();
        resetGameBoard();
    };

    // Change Background Color Randomly
    const randomBackground = () => {
        const colors = ["#1e3a8a", "#3b82f6", "#0f172a", "#1e293b", "#172554"];
        document.body.style.background = colors[Math.floor(Math.random() * colors.length)];
    };

    // Check for Winner
    const checkWinner = () => {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[b].innerText === boxes[c].innerText) {
                showWinner(boxes[a].innerText, pattern);
                return true;
            }
        }
        if (count === 9) {
            scores.Draw++;
            updateScoreboard();
            msg.innerText = "It's a Draw!";
            msgContainer.classList.remove("hide");
        }
        return false;
    };

    // Show Winner
    const showWinner = (winner, pattern) => {
        scores[winner]++;
        updateScoreboard();
        msg.innerText = `Winner: ${winner}`;
        msgContainer.classList.remove("hide");
        pattern.forEach(index => boxes[index].classList.add("winner"));
        boxes.forEach(box => box.disabled = true);
    };

    // Update Scoreboard
    const updateScoreboard = () => {
        scoreX.innerText = scores.X;
        scoreO.innerText = scores.O;
        scoreDraw.innerText = scores.Draw;
    };

    // AI Move (Plays as 'X')
    const aiMove = () => {
        let availableBoxes = [...boxes].filter(box => box.innerText === "");
        if (availableBoxes.length === 0) return;

        let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        randomBox.innerText = "X";
        randomBox.disabled = true;
        randomBox.style.backgroundColor = "#ff6b6b"; // AI move in red
        count++;

        if (!checkWinner()) {
            turnO = !turnO; // Switch turn to human
        }
    };

    // Player Move (Handles both AI ON and OFF)
    boxes.forEach((box) => {
        box.addEventListener("click", () => {
            if (!box.innerText) {
                if (turnO) {
                    box.innerText = "O"; // Human (O) plays
                    box.style.backgroundColor = "#4caf50"; // Green for human
                } else {
                    box.innerText = "X"; // Human (X) plays in 2-player mode
                    box.style.backgroundColor = "#ff6b6b"; // Red for human (if AI is off)
                }

                box.disabled = true;
                count++;

                if (!checkWinner()) {
                    turnO = !turnO; // Switch turns
                    if (aiEnabled && !turnO) {
                        setTimeout(aiMove, 500); // AI plays after delay
                    }
                }
            }
        });
    });

    // Fix: New Game Button (Keeps Score)
    newGameBtn.addEventListener("click", resetGameBoard);
    resetBtn.addEventListener("click", fullReset);
});
