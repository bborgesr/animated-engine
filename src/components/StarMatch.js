import React, { useState, useEffect } from "react";

import utils from "../utils/math";
import PlayNumber from "./PlayNumber";
import StarsDisplay from "./StarsDisplay";
import PlayAgain from "./PlayAgain";

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));

  // candidate numbers
  const [candidateNums, setCandidateNums] = useState([]);

  // wrong numbers - don't place on the state; can be computed
  // used numbers - don't place on the state; can be computed
  // available numbers
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));

  const [secondsLeft, setSecondsLeft] = useState(40);

  // setInterval, setTimeout
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const candidatesAreWrong = utils.sum(candidateNums) > stars;

  //   const gameIsWon = availableNums.length === 0;
  //   const gameIsLost = secondsLeft === 0;
  const gameStatus =
    availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
  };

  const numberStatus = number => {
    if (!availableNums.includes(number)) {
      return "used";
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate";
    }
    return "available";
  };

  const onNumberClick = (number, currentStatus) => {
    // currentStatus => newStatus
    if (currentStatus === "used" || gameStatus !== "active") return;

    // candidateNums
    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      // redraw stars (from what's available)
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "active" ? (
            <PlayAgain onClick={resetGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(n => {
            const status = numberStatus(n);
            return (
              <PlayNumber
                key={n}
                number={n}
                status={status}
                onClick={onNumberClick}
              />
            );
          })}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

export default StarMatch;
