import './Newtab.css';
import './Newtab.scss';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import secrets from '../../../secrets.development.js';

const Newtab = () => {


  const [question, setQuestion] = useState({ question: "Loading...", options: [] });
  const [seenQuestions, setSeenQuestions] = useState([1, 2, 9]);
  const [url, setUrl] = useState('');

  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);


  const { SUPABASE_URL, SUPABASE_ANON_KEY } = secrets;

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // console.log(supabase);

  console.log(question);


  const fetchUnseenQuestion = async () => {
    let { data: questions, error } = await supabase
      .rpc('get_unseen_question', { seen_ids: [1, 2, 10, 9] });

    console.log(questions[0]);

    setQuestion(questions[0]);

    if (error) {
      console.log('error', error);
      return;
    }

    // The stored procedure returns only one question
    const { id, created_at, question: questionData } = questions[0];

    setQuestion(questionData);


  }

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

  //Store the URL from chrome.storage using useEffect
  useEffect(() => {

    // Grab the questions from the database, ignore if id is 1,5

    fetchUnseenQuestion();

    chrome.storage.local.get('url', (data) => {
      // Remove https:// from the URL and remove .com and everything after .com
      const urlObject = new URL(data.url);

      // Get the hostname from the URL object
      let hostname = urlObject.hostname;

      hostname = hostname.replace('www.', '').replace('.com', '');

      // Set the state
      setUrl(hostname);
    });
  },
    []
  );

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
        <p>
          Quiz yourself before you continue to {url}
        </p>
        {/* <h6>
          Change subjects you want to learn about in setting pages.
        </h6> */}
        {/* <button onClick={handleClick}>Enter</button> */}
        <h2>{question.question}</h2>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleClickOption(option)}>
            {/* style={{ backgroundColor: option === correctAnswer ? 'green' : 'initial' }}> */}
            {option}
          </button>
        ))}
      </header>

    </div>

  );
};

export default Newtab;