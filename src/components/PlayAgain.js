import React from "react";

const PlayAgain = props => {
  const isLost = props.gameStatus === "lost";
  return (
    <div className="game-done">
      <div className="message" style={{ color: isLost ? "red" : "green" }}>
        {isLost ? "Game Over" : "Nice"}
      </div>
      <button onClick={props.onClick}>Play Again</button>
    </div>
  );
};

export default PlayAgain;
