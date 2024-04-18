import './Newtab.css';
import './Newtab.scss';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const Newtab = () => {
  const [question, setQuestion] = useState({
    question: 'Loading...',
    options: [],
    questionId: null
  });

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questionId, setQuestionId] = useState(null);



  const supabase = createClient(
    'https://vdoqyjbnpwqkafxxssbb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F5amJucHdxa2FmeHhzc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzIyMTUsImV4cCI6MjAyNjk0ODIxNX0.luuvoKY-udlAaD83Qf5pElsetmXVwPetr6C-v5gpjDg'
  );

  useEffect(() => {

    // Get data from chrome storage
    chrome.storage.local.get(['category', 'difficulty', 'seenQuestions'], async (data) => {
      // Fetch the unseen question on page load
      await fetchUnseenQuestion(data.seenQuestions, data.category, data.difficulty);

      console.log('Data:', data);
    });

    // Simplfy the URL to display
    chrome.storage.local.get('url', (data) => {
      // Remove https:// from the URL and remove .com and everything after .com
      const urlObject = new URL(data.url);

      // Get the hostname from the URL object
      let hostname = urlObject.hostname;

      hostname = hostname.replace('www.', '').replace('.com', '');

      // Set the state
      setUrl(hostname);
    });

  }, []);

  const fetchUnseenQuestion = async (seenQuestions, category, difficulty) => {

    // Call the stored procedure to get the unseen question
    let { data: questions, error } = await supabase
      .rpc('get_unseen_question', { seen_ids: seenQuestions, question_category: category, question_difficulty: difficulty });


    // We do this to display h4, if no questions are found. Redo later.
    setQuestion(questions[0]);

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    if (!questions || questions.length === 0) {
      console.error(
        'No questions found for the specified category and difficulty'
      );
      setIsLoading(false);
      return;
    }

    // The stored procedure returns only one question
    const { id, created_at, question: questionData } = questions[0];

    setQuestionId(id);
    // Update the state with the question
    setQuestion(questionData);

    // Set the loading state to false
    setIsLoading(false);

    console.log('Question:', questionData);

    // Update the seen questions in chrome storage
    // chrome.storage.local.set({ seenQuestions: [...seenQuestions, id] });

  };



  function Loading() {
    return <div>Loading...</div>;
  }




  function Question({ question }) {

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
        seenQuestions.push(questionId);

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


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Quiz yourself before you continue to {url}</p>
        {/* <h6>
          Change subjects you want to learn about in setting pages.
        </h6> */}
        {/* <button onClick={handleClick}>Enter</button> */}
        <div>
          {isLoading ? (
            <Loading />
          ) : question ? (
            <Question question={question} />
          ) : (
            <>
              <h4>No questions found. </h4>
              <h4>
                Reset your seen id's counter and commit some new question
              </h4>
            </>
          )}
          {/* Rest of your JSX... */}
        </div>
      </header>
    </div>
  );
};

export default Newtab;
