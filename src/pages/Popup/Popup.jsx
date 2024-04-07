import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [isPluginActive, setIsPluginActive] = useState(true);
  const [domainChanges, setDomainChanges] = useState(0);


  const [email, setEmail] = useState('');
  const emails = ['gmail.com', 'slack', 'stackoverflow', 'hackernews'];

  useEffect(() => {
    // Load and set defaults
    chrome.storage.local.get(
      ['difficulty', 'category', 'isPluginActive', 'domainChanges'],
      function (result) {
        setDifficulty(result.difficulty);
        setCategory(result.category);
        setIsPluginActive(result.isPluginActive);
        setDomainChanges(result.domainChanges);
      }
    );
  }, []);

  const handleSubmit = () => {
    // Check if the URL is already blocked
    if (blockedUrls.includes(url)) {
      alert('URL already in the list');
      return;
    }

    // Inform the user has to include . it can just be google it has to be google.com
    if (!url.includes('.')) {
      alert('Invalid URL');
      return;
    }

    chrome.storage.sync.set(
      { [url]: description, difficulty: difficulty },
      function () {
        // Update the state with the new URL
        setBlockedUrls((prevUrls) => [...prevUrls, url]);
      }
    );
  };

  const handleRemoveUrl = (urlToRemove) => {
    // Remove the URL from Chrome storage
    chrome.storage.sync.remove(urlToRemove, function () {
      // Update the state to reflect the change
      setBlockedUrls(blockedUrls.filter((url) => url !== urlToRemove));
    });
  };

  const handleIsPluginActiveChange = (event) => {
    setIsPluginActive(event.target.checked);
    chrome.storage.local.set({ isPluginActive: event.target.checked });

    console.log('isPluginActive: ', event.target.checked);
  };

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setDomainChanges(value);

    // Store the domainChanges inside chrome storage
    chrome.storage.local.set({ domainChanges: value });
  };

  const handleSetDifficulty = (event) => {
    setDifficulty(event.target.value);

    // Store the difficulty inside chrome storage
    chrome.storage.local.set({ difficulty: event.target.value });
  };

  const handleSetcategory = (event) => {
    setCategory(event.target.value);

    // Store the category inside chrome storage
    chrome.storage.local.set({ category: event.target.value });
  };

  function mapDomainChangesToString(domainChanges) {
    if (domainChanges >= 50 && domainChanges <= 60) {
      return 'rarely';
    } else if (domainChanges >= 30 && domainChanges < 50) {
      return 'somewhat';
    } else if (domainChanges >= 10 && domainChanges < 30) {
      return 'often';
    } else {
      return 'invalid';
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <br />
        <label>
          Select category and difficulty
        </label>
        <select value={difficulty} onChange={(e) => handleSetDifficulty(e)}>
          <option value="easy">Easy</option>
          <option value="hard">Hard</option>
        </select>{' '}
        <select value={category} onChange={(e) => handleSetcategory(e)}>
          <option value="javascript">Javascript</option>
          <option value="typescript">Typescript</option>
          <option value="python">Python</option>
          <option value="react">React</option>
          <options value="techy">Techincal</options>
        </select>{' '}

        <br />

        <label htmlFor="domainChanges">Choose the frequency?  {mapDomainChangesToString(domainChanges)}
        </label>
        <input
          id="domainChanges"
          type="range"
          min="10"
          max="60"
          value={domainChanges}
          onChange={handleSliderChange}
        />
        <div className="toggle-container">

          <input
            type="checkbox"
            id="toggle"
            className="toggle-switch-checkbox"
            checked={isPluginActive}
            onChange={(e) => handleIsPluginActiveChange(e)}
          />
          <label className="toggle-switch-slider" htmlFor="toggle">
            <span className="toggle-switch-slider--text">
              {isPluginActive ? 'On' : 'Off'}
            </span>
          </label>
        </div>

        <br />

        <label>
          Exclude URL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <button onClick={console.log("Added")}>Add</button>
        {emails.map((email, index) => (
          <div key={index}>
            {email} <button onClick={() => console.log("Removed")(index)}>x</button>
          </div>
        ))}
      </header>
    </div>
  );
};

export default Popup;
