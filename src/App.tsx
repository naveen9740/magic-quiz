import React, { useState } from "react";
import { QuestionCard } from "./components/QuestionCard";
import { fetchQuizQuestions } from "./Api";

// Types
import { QuestionState, Difficulty } from "./Api";
const total = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAns: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setuserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(total, Difficulty.easy);
    setQuestions(newQuestions);
    setScore(0);
    setuserAnswers([]);
    setNumber(0);
    setLoading(false);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObj = {
        question: questions[number].question,
        answer,
        correct,
        correctAns: questions[number].correct_answer,
      };
      setuserAnswers((prev) => [...prev, answerObj]);
    }
  };
  const nextQuestion = () => {
    const nextQ = number + 1;
    if (nextQ === total) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
    }
  };
  return (
    <div>
      <h1>Magic Quiz</h1>
      {gameOver || userAnswers.length === total ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {!gameOver ? <p className="score">Score: 0</p> : null}
      {loading ? <p>Loading Question</p> : null}
      {!loading && !gameOver && (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={total}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver &&
      !loading &&
      userAnswers.length === number + 1 &&
      number != total - 1 ? (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}
    </div>
  );
};

export default App;
