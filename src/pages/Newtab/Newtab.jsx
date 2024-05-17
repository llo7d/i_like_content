import './Newtab.css';
import './Newtab.scss';
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CheckCirClrkSVG from '../../components/Check-Circle';
import UnCheckCirClrkSVG from '../../components/UnCheck-Circle';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel'; // Cần parser này cho JavaScript

const CodeSyntaxHighlighter = ({
  language = 'react',
  codeString = '',
}) => {
  const formattedCodeString = prettier.format(codeString, {
    parser: 'babel',
    plugins: [parserBabel],
  });

  return (
    <SyntaxHighlighter
      language={language}
      style={atomOneDark}
      showLineNumbers
      customStyle={{
        backgroundColor: 'transparent',
      }}
    >
      {formattedCodeString}
    </SyntaxHighlighter>
  );
};

const Newtab = () => {
  const [question, setQuestion] = useState({
    question: 'Loading...',
    options: [],
    questionId: null,
  });

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questionId, setQuestionId] = useState(null);
  const [originQuestionData, setOriginQuestionData] = useState({});

  const supabase = createClient(
    'https://vdoqyjbnpwqkafxxssbb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F5amJucHdxa2FmeHhzc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzIyMTUsImV4cCI6MjAyNjk0ODIxNX0.luuvoKY-udlAaD83Qf5pElsetmXVwPetr6C-v5gpjDg'
  );


  useEffect(() => {
    // Get data from chrome storage
    chrome.storage.local.get(
      ['category', 'difficulty', 'seenQuestions'],
      async (data) => {
        // Fetch the unseen question on page load
        await fetchUnseenQuestion(
          data.seenQuestions,
          data.category,
          data.difficulty
        );
      }
    );

    // Simply the URL to display
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
    let { data: questions, error } = await supabase.rpc('get_unseen_question', {
      seen_ids: seenQuestions,
      question_category: category,
      question_difficulty: difficulty,
    });

    // console.log(questions);
    // We do this to display h4, if no questions are found. Redo later.

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    if (!questions || questions.length === 0) {
      console.error(
        'No questions found for the specified category and difficulty'
      );
      setIsLoading(false);
      setQuestion(null);
      return;
    }
    setOriginQuestionData(questions[0]);
    // The stored procedure returns only one question
    const { id, question: questionData } = questions[0];

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

  function Question({ question, language = 'javascript' }) {
    console.log('🚀 ~ Question ~ language:', language);
    console.log('🚀 ~ Question ~ question:', question);
    const [selectedOption, setSelectedOption] = useState(null);
    const [redirecting, setRedirecting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const formattedCode = useMemo(() => {
      try {
        if (language === 'javascript' && question?.question?.codeSnippet) {
          return prettier.format(question?.question?.codeSnippet, {
            parser: 'babel',
            plugins: [parserBabel],
          });
        }
        return question?.question?.codeSnippet;
      } catch (error) {
        console.error('Error formatting code:', error);
        return question?.question?.codeSnippet; // Trả về code gốc nếu có lỗi
      }
    }, [language, question?.question?.codeSnippet]);

    const checkAnswer = (option) => {

      setSelectedOption(option);

      if (option === question.correctAnswer) {
        setFeedbackMessage('That is correct, redirecting...');
      } else {
        setFeedbackMessage(
          'That was wrong... stop watching videos.. redirecting...'
        );
      }

      // Get the current seenQuestions from chrome storage
      chrome.storage.local.get(['seenQuestions'], function (data) {
        let seenQuestions = data.seenQuestions || [];

        // Add the current question id to seenQuestions
        seenQuestions.push(questionId);

        // Update the seen questions in chrome storage
        chrome.storage.local.set({ seenQuestions }, function () {
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
        <div>
          <div className="question-content">{question.question.text}</div>
          {question.question.codeSnippet && (
            <div className="code-string scroll">
              <div className="code-snippet">codesnippet</div>
              {/* Integrate the solution here */}
              <SyntaxHighlighter
                language="javascript"
                style={atomOneDark}
                customStyle={{
                  backgroundColor: 'transparent', // Remove background color
                  padding: '0', // Remove padding
                  margin: '0', // Remove margin
                  fontSize: 'inherit', // Inherit font size
                }}
              >
                {question.question.codeSnippet}
              </SyntaxHighlighter>

            </div>
          )}

          <div className="question-choose">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(option)}
                className={`question-choose-button flex justify-space-between ${selectedOption
                  ? option === question.correctAnswer
                    ? 'active'
                    : option === selectedOption
                      ? 'wrong'
                      : ''
                  : ''
                  }`}
              >
                <div className="flex column-gap-8 items-center">
                  {!selectedOption && (
                    <div className="check-box">
                      <input
                        type="checkbox"
                        name="answer"
                        id={`answer-${index}`}
                        defaultChecked={option === selectedOption}
                      />
                      <label htmlFor={`answer-${index}`}></label>
                    </div>
                  )}
                  {option === question.correctAnswer && selectedOption && (
                    <CheckCirClrkSVG />
                  )}
                  {option !== question.correctAnswer && selectedOption && (
                    <UnCheckCirClrkSVG />
                  )}
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {redirecting && <p>{feedbackMessage}</p>}
        </div>

      </div>
    );
  }

  function pausePlugin(time = 1 * 60 * 60 * 1000) {
    // Get the current time
    const currentTime = new Date().getTime();

    // Calculate the time to pause the plugin
    const pausedTime = currentTime + time;

    // Set the pause time in chrome storage
    chrome.storage.local.set({ pausedTime }, function () {
      console.log('Plugin paused for 1 hour');
    });
  }

  return (
    <div className="App">
      <div className="container w-full">
        <header className="App-header">
          <div className="flex items-center justify-space-between w-full mb-24">
            {originQuestionData?.category && originQuestionData?.difficulty && (
              <div className="flex column-gap-8 items-center">
                <span className="question-category">
                  {originQuestionData?.category}
                </span>
                <span className="question-dot"></span>
                <span className="question-level">
                  {originQuestionData?.difficulty}
                </span>
              </div>
            )}
            {/* open link github*/}
            <a
              className="question-created"
              href={`http://${originQuestionData?.your_github_url}`}
              target="_blank"
              rel="noreferrer"
            >
              {originQuestionData?.your_name}
            </a>
          </div>
          <div>
            {isLoading ? (
              <Loading />
            ) : question ? (
              <Question
                question={question}
                language={originQuestionData?.category}
              />
            ) : (
              <>
                <h2 className="question-content">No questions found.</h2>
                <h2 className="question-content">
                  You have seen all questions. <a href="https://github.com/llo7d/i_like_content/issues" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Submit new questions</a>
                </h2>
                <div className="flex justify-center">
                  <button
                    className="question-choose-button flex justify-space-between"
                    onClick={() => {
                      chrome.storage.local.set({ seenQuestions: [] }, () => {
                        alert('Questions reset');
                        chrome.tabs.goBack();
                      });
                    }}
                  >
                    <span>Reset seen questions</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <div
          className="flex justify-center items-center"
          style={{
            marginTop: '92px',
          }}
        >
          {/* Adding this later */}
          {/* <span className="pause-button" onClick={() => pausePlugin()}>
            Pause me for 1 hour
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default Newtab;
