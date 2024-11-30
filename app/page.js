"use client";
import { questions } from "@/questions";
import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { MdGTranslate } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [selectedOptionState, setSelectedOptionState] = useState(
    new Array(questions.length).fill(null)
  );

  const correctAnswers = questions.map((q, index) => q.answer[language]);
  const unattemptedQuestionsCount = selectedOptionState.filter(
    (opt) => opt === null
  ).length;
  const correctQuestionsCount = selectedOptionState.filter(
    (opt, index) => opt === correctAnswers[index]
  ).length;
  const incorrectQuestionsCount = selectedOptionState.filter(
    (opt, index) => opt !== correctAnswers[index] && opt !== null
  ).length;
  const totalQuestions = questions.length;

  useEffect(() => {
    if (timeLeft === 0) {
      setShowResults(true);
    } else {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
  }

  function toggleLanguage() {
    setLanguage(language === "en" ? "hi" : "en");
  }

  function handleOptionSelect(option) {
    const newSelectedOptions = [...selectedOptionState];
    newSelectedOptions[currentQuestion] = option;
    setSelectedOptionState(newSelectedOptions);
    setShowAnswer(true);

    const correctAnswer = questions[currentQuestion].answer[language];

    if (option === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  }

  function handleNextClick() {
    if (currentQuestion === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion((prevQn) => prevQn + 1);
    }
    setShowAnswer(false);
    setSelectedOption("");
  }

  function handlePrevClick() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prevQn) => prevQn - 1);
    }
  }

  function restartQuiz() {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption("");
    setShowAnswer(false);
    setShowResults(false);
    setTimeLeft(60);
    setIsQuizSubmitted(false);
    setSelectedOptionState(new Array(questions.length).fill(null));
  }

  function openSubmitModal() {
    setIsSubmitModalOpen(true);
  }

  function handleReport() {
    setOpenReportModal(true);
  }

  function closeReportModal() {
    setOpenReportModal(false);
  }

  function closeSubmitModal() {
    setIsSubmitModalOpen(false);
  }

  function submitQuiz() {
    setIsQuizSubmitted(true);
    setIsSubmitModalOpen(false);
    setShowResults(true);
  }

  function submitReport() {
    toast.success("Report submitted successfully!");
    closeReportModal();
  }

  return (
    <div
      className={` quiz-app ${
        isDarkMode ? "text-white !bg-gray-700" : "text-light"
      }`}
    >
      <div
        className={` !rounded-lg ${
          isDarkMode ? "bg-gray-600" : "bg-gray-200"
        }  flex  justify-around items-center font-semibold w-full p-4`}
      >
        <h2>QUIZ 20</h2>

        <div className="timer bg-gray-300 px-4 p-1 text-gray-700 rounded-md">
          <p>Time Left: {timeLeft}s</p>
        </div>

        <button onClick={toggleTheme} className="">
          {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </div>

      <div className="flex justify-between items-center w-full p-4">
        <h2>Quiz by Quiz20</h2>
        <div onClick={toggleLanguage} className="">
          {!showResults && (
            <button onClick={openSubmitModal} className="submit-btn">
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {showResults ? (
        <div className="results">
          <div className="score-counter">
            <div className="circle">
              <span>{score}</span>
            </div>
          </div>

          <div className="results-summary">
            <p>Correct: {correctQuestionsCount}</p>
            <p>Incorrect: {incorrectQuestionsCount}</p>
            <p>Non-Attempted: {unattemptedQuestionsCount}</p>
            <p>
              <strong>Positive: {correctQuestionsCount}</strong>
            </p>
            <p>
              <strong>Negative: {incorrectQuestionsCount}</strong>
            </p>
            <p>
              <strong>Total: {score}</strong>
            </p>
          </div>

          <div className="leaderboard">
            <h3
              style={{
                backgroundColor: "pink",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Leaderboard
            </h3>
          </div>

          <div className="bottom-buttons">
            <button className="share-btn">Share</button>
            <button className="answers-btn">Answers</button>
          </div>

          <button
            className={` border ${
              !isDarkMode ? "border-black" : "border-white"
            }`}
            onClick={restartQuiz}
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-between items-center pr-6">
            <h3>
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <div className="flex gap-2">
              <MdGTranslate
                className="cursor-pointer"
                size={24}
                onClick={toggleLanguage}
              />
              <IoIosWarning onClick={handleReport} size={24} />
            </div>
          </div>

          <div className=" quiz-body">
            <h1>
              {questions[currentQuestion].id}.{" "}
              {questions[currentQuestion].question[language]}
            </h1>

            <div className="options text-left sm:max-w-[700px]">
              {questions[currentQuestion].options[language].map((option) => {
                const correctAnswer =
                  questions[currentQuestion].answer[language];

                return (
                  <button
                    key={option}
                    className={`text-left  ${
                      showAnswer
                        ? option === correctAnswer
                          ? "correct"
                          : option === selectedOptionState[currentQuestion]
                          ? "wrong"
                          : ""
                        : ""
                    } ${isDarkMode && "text-black"}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`flex-1 border ${
                isDarkMode ? "!border-white" : "!border-black"
              } `}
              onClick={handlePrevClick}
              disabled={currentQuestion === 0}
            >
              PREVIOUS
            </button>
            <button
              onClick={handleNextClick}
              className={`flex-1 border ${
                isDarkMode ? "border-white" : "border-black"
              } `}
              disabled={showAnswer === false}
            >
              NEXT
            </button>
          </div>
        </>
      )}

      {isSubmitModalOpen && (
        <div className="submit-modal">
          <div className="submit-modal-content">
            <h3>Submit Quiz</h3>
            <p>Unattempted Questions: {unattemptedQuestionsCount}</p>
            <p>
              Once you submit the quiz, you will not be able to modify your
              answers.
            </p>
            <p>Are you sure you want to submit?</p>
            <div className="submit-buttons">
              <button onClick={submitQuiz} className="submit-btn">
                Yes
              </button>
              <button onClick={closeSubmitModal} className="cancel-btn">
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {openReportModal && (
        <div
          className={`submit-modal ${
            isDarkMode
              ? "!border-white !text-black "
              : "border-black "
          }`}
        >
          <div
            className={`submit-modal-content ${
              isDarkMode
                ? "!border-white !text-black "
                : "border-black "
            }`}
          >
            <fieldset>
              <legend>Report an Issue</legend>
              {[
                { id: "wrong-question", label: "Question is wrong" },
                { id: "wrong-answer", label: "Answer is wrong" },
                { id: "spelling-mistake", label: "Spelling mistake" },
                { id: "different-subject", label: "Subject is different" },
                { id: "other", label: "Other" },
              ].map((option) => (
                <div key={option.id} className="report-option">
                  <input type="radio" name="report" id={option.id} />
                  <label htmlFor={option.id}>{option.label}</label>
                </div>
              ))}
            </fieldset>
            <div className="submit-buttons">
              <button onClick={submitReport} className="submit-btn">
                Report
              </button>
              <button onClick={closeReportModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
