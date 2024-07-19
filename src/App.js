import { useState } from "react";

/**
 * Square component renders a single square.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.value - The value to be displayed in the square.
 * @param {function} props.onSquareClick - The function to call when the square is clicked.
 * @returns {JSX.Element} The rendered square component.
 */
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * Game component manages the state and logic of the Tic-Tac-Toe game.
 *
 * @returns {JSX.Element} The rendered game component.
 */
export default function Game() {
  const [roundNum, setRoundNum] = useState(0);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [history, setHistory] = useState(Array(9).fill(null));

  const p1 = "X";
  const p2 = "O";

  const winner = calculateWinner(squares);
  let status;
  let againContent = null;

  checkGameOver();

  /**
   * Determines the game status and sets the status and handles the button for replaying.
   */
  function checkGameOver() {
    if (roundNum >= 9) {
      status = "Game Over, it's a draw!";
    } else if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (roundNum % 2 === 0 ? p1 : p2);
    }

    if (roundNum >= 9 || winner) {
      againContent = <button onClick={reloadPage}>Again?</button>;
    }
  }

  /**
   * Resets the game state to its initial state.
   */
  function reloadPage() {
    setSquares(Array(9).fill(null));
    setRoundNum(0);
    setHistory(Array(9).fill(null));
  }

  /**
   * Navigates back to a previous game state.
   *
   * @param {number} index - The index of the state to navigate back to.
   */
  function backToState(index) {
    setSquares(history[index]);

    const modifiedHistory = history.slice();

    for (let i = index; i < history.length; i++) {
      modifiedHistory[i] = null;
    }
    setHistory(modifiedHistory);
    setRoundNum(index);
  }

  /**
   * Renders a single square.
   *
   * @param {number} index - The index of the square to render.
   * @returns {JSX.Element} The rendered square component.
   */
  function renderSquare(index) {
    return (
      <Square value={squares[index]} onSquareClick={() => Clicked(index)} />
    );
  }

  /**
   * Renders a row of squares starting from a given index.
   *
   * @param {number} startIndex - The starting index of the row to render.
   * @returns {JSX.Element} The rendered row of squares.
   */
  function renderRowFrom(startIndex) {
    const squares = [];
    for (let i = 0; i < 3; i++) {
      squares.push(renderSquare(startIndex + i));
    }
    return (
      <div className="board-row" key={startIndex}>
        {squares}
      </div>
    );
  }

  /**
   * Handles a click on a square.
   *
   * @param {number} index - The index of the clicked square.
   */
  function Clicked(index) {
    if (squares[index] || calculateWinner()) {
      return;
    }

    const nextSquares = squares.slice();

    if (roundNum % 2 === 0) {
      nextSquares[index] = p1;
    } else {
      nextSquares[index] = p2;
    }
    setRoundNum(roundNum + 1);
    setSquares(nextSquares);

    const modifiedHistory = history.slice();
    modifiedHistory[roundNum] = squares;
    setHistory(modifiedHistory);
  }

  /**
   * Calculates the winner of the game.
   *
   * @returns {string|boolean} The winner ("X" or "O") if there is one, otherwise false.
   */
  function calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[b] &&
        squares[c] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    return false;
  }

  const moves = history.map((state, index) =>
    state ? (
      <button onClick={() => backToState(index)}>Back to move {index}</button>
    ) : (
      ""
    )
  );

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <div className="status">{againContent}</div>
        <div className="board-row">{renderRowFrom(0)}</div>
        <div className="board-row">{renderRowFrom(3)}</div>
        <div className="board-row">{renderRowFrom(6)}</div>
      </div>
      <div className="game-info">{moves}</div>
    </div>
  );
}
