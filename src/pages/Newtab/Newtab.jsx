import './Newtab.css';
import './Newtab.scss';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const Newtab = () => {
  const [question, setQuestion] = useState({
    question: 'Loading...',
    options: [],
  });

  const [seenQuestions, setSeenQuestions] = useState([1, 2, 9]);
  const [url, setUrl] = useState('');
  // Grab the category and difficulty from chrome.storage
  const [category, setcategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const supabase = createClient(
    'https://vdoqyjbnpwqkafxxssbb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F5amJucHdxa2FmeHhzc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzIyMTUsImV4cCI6MjAyNjk0ODIxNX0.luuvoKY-udlAaD83Qf5pElsetmXVwPetr6C-v5gpjDg'
  );

  useEffect(() => {
    chrome.storage.local.get(['category', 'difficulty'], async (data) => {
      setcategory(data.category);
      setDifficulty(data.difficulty);

      await fetchUnseenQuestion();
    });

    chrome.storage.local.get('url', (data) => {
      // Remove https:// from the URL and remove .com and everything after .com
      const urlObject = new URL(data.url);

      // Get the hostname from the URL object
      let hostname = urlObject.hostname;

      hostname = hostname.replace('www.', '').replace('.com', '');

      // Set the state
      setUrl(hostname);
    });

    console.log(category, difficulty);
  }, []);

  const fetchUnseenQuestion = async (category1, difficulty1) => {
    // const fetchUnseenQuestion = async () => {
    //   let { data: questions, error } = await supabase
    //     .rpc('get_unseen_question', { seen_ids: [1, 2, 10, 9] });

    let { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', 'react')
      .eq('difficulty', 'easy');

    console.log(questions[0]);

    setQuestion(questions[0]);

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    if (!questions || questions.length === 0) {
      console.error(
        'No questions found for the specified category and difficulty'
      );
      return;
    }

    // The stored procedure returns only one question
    const { id, created_at, question: questionData } = questions[0];

    setQuestion(questionData);
  };

  const handleClickOption = (option) => {
    console.log('Option clicked:', option);
    setSelectedOption(option);

    if (option === question.answer) {
      console.log('Correct answer selected');
      setCorrectAnswer(option);

      setTimeout(() => {
        chrome.tabs.goBack();
      }, 2000);
    }
  };

  const handleClick = () => {
    // // Get the stored URL from chrome.storage
    // chrome.storage.local.get('url', (data) => {

    //   console.log(data.url);
    //   // Redirect the from the current active tab to the stored URL
    //   chrome.tabs.update({ url: data.url });

    //   // Redirect to the last page the user visited
    // });

    chrome.tabs.goBack();
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Quiz yourself before you continue to {url}</p>
        {/* <h6>
          Change subjects you want to learn about in setting pages.
        </h6> */}
        {/* <button onClick={handleClick}>Enter</button> */}
        <h4>{question.question.text}</h4>
        {question.question.codeSnippet && (
          <pre>{question.question.codeSnippet}</pre>
        )}
        {question.options.map((option, index) => (
          <button key={index} onClick={() => handleClickOption(option)}>
            {/* style={{ backgroundColor: option === correctAnswer ? 'green' : 'initial' }}> */}
            {option}
          </button>
        ))}
      </header>
    </div>
  );
};

export default Newtab;
