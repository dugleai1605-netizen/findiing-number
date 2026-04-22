import { useState, useEffect } from 'react';
import './index.css';

const NUM_CARDS = 20;

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateBoard() {
  const numbers = Array.from({ length: NUM_CARDS }, (_, i) => i + 1);
  const shuffled = shuffleArray(numbers);
  return shuffled.map((num, index) => ({
    id: index,
    value: num,
    isFlipped: false,
    isError: false,
  }));
}

function App() {
  const [board, setBoard] = useState(generateBoard());
  const [turn, setTurn] = useState(1);
  const [target, setTarget] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleCardClick = (clickedCard) => {
    // Prevent clicking if processing an error, game over, or card already flipped
    if (isProcessing || winner || clickedCard.isFlipped) return;

    // Flip the clicked card
    const newBoard = board.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );

    if (clickedCard.value === target) {
      // CORRECT GUESS
      setBoard(newBoard);
      
      if (target === NUM_CARDS) {
        setWinner(turn);
      } else {
        setTarget(target + 1);
      }
    } else {
      // INCORRECT GUESS
      setIsProcessing(true);
      // Mark the wrong card as an error for styling
      const errorBoard = newBoard.map(card => 
        card.id === clickedCard.id ? { ...card, isError: true } : card
      );
      setBoard(errorBoard);

      // Wait a moment for the user to see their mistake, then reset
      setTimeout(() => {
        setBoard(board => board.map(card => ({ ...card, isFlipped: false, isError: false })));
        setTarget(1);
        setTurn(turn === 1 ? 2 : 1);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const resetGame = () => {
    setBoard(generateBoard());
    setTurn(1);
    setTarget(1);
    setWinner(null);
    setIsProcessing(false);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Sequence Memory</h1>
        {winner ? (
          <div className="winner-banner">
            <h2>Player {winner} Wins! 🎉</h2>
            <button className="reset-btn" onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <div className="status-panel">
            <div className={`player-badge ${turn === 1 ? 'active' : ''}`}>
              Player 1
            </div>
            <div className="target-indicator">
              <span>Find</span>
              <div className="target-number">{target}</div>
            </div>
            <div className={`player-badge ${turn === 2 ? 'active' : ''}`}>
              Player 2
            </div>
          </div>
        )}
      </div>

      <div className="grid-container">
        {board.map((card) => (
          <div 
            key={card.id} 
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isError ? 'error' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front">
                <div className="card-pattern"></div>
              </div>
              <div className="card-back">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
