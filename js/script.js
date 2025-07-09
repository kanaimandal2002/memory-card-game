document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const resetButton = document.getElementById('reset');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let matchedPairs = 0;
    const totalPairs = 8; // For a 4x4 grid (16 cards)
    
    // Card types (use your own images)
    const cardTypes = [
        'apple', 'banana', 'cherry', 'orange',
        'strawberry', 'watermelon', 'pear', 'grape'
    ];
    
    // Initialize game
    function initGame() {
        // Clear the board
        gameBoard.innerHTML = '';
        moves = 0;
        timer = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        timerDisplay.textContent = timer;
        clearInterval(timerInterval);
        
        // Create cards
        cards = [];
        const cardDeck = [...cardTypes, ...cardTypes]; // Duplicate for pairs
        cardDeck.sort(() => 0.5 - Math.random()); // Shuffle
        
        // Create card elements
        cardDeck.forEach((type, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.type = type;
            card.dataset.index = index;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = '?';
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            const img = document.createElement('img');
            img.src = `images/${type}.png`;
            img.alt = type;
            cardFront.appendChild(img);
            
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
        
        // Start timer
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
        }, 1000);
    }
    
    // Flip card
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }
    
    // Check for match
    function checkForMatch() {
        const isMatch = firstCard.dataset.type === secondCard.dataset.type;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    alert(`Congratulations! You won in ${moves} moves and ${timer} seconds!`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    // Disable matched cards
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Unflip cards if no match
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    // Reset board state
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // Reset game
    resetButton.addEventListener('click', initGame);
    
    // Start the game
    initGame();
});
