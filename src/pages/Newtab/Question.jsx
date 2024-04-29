import './css/Newtab.css';
import './css/Newtab.scss';
import React, { useState } from 'react';

export default function Question({ question }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [redirecting, setRedirecting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const checkAnswer = (option) => {
      setSelectedOption(option);

      if (option === question.correctAnswer) {
        setFeedbackMessage('That is correct, redirecting...');
      } else {
        setFeedbackMessage('That was wrong... stop watching videos.. redirecting...');
      }

      // Get the current seenQuestions from chrome storage
      chrome.storage.local.get(['seenQuestions'], function (data) {
        let seenQuestions = data.seenQuestions || [];

        // Add the current question id to seenQuestions
        seenQuestions.push(question.questionId);

        // Update the seen questions in chrome storage
        chrome.storage.local.set({ seenQuestions: seenQuestions }, function () {
          console.log('Seen questions updated in Chrome storage');
        });
      });

      setRedirecting(true);

      // Redirect the user to the last page they visited after 3 seconds
      setTimeout(() => {
        chrome.tabs.goBack();
      }, 1500);
    };

    return (
      <div>
        <h2>{question.question.text}</h2>
        {question.question.codeSnippet && <pre>{question.question.codeSnippet}</pre>}
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => checkAnswer(option)}
            style={{
              backgroundColor: selectedOption
                ? option === question.correctAnswer
                  ? 'green'
                  : option === selectedOption
                    ? 'red'
                    : ''
                : ''
            }}
          >
            {option}
          </button>
        ))}
        {redirecting && <p>{feedbackMessage}</p>}

      </div>
    );
  }