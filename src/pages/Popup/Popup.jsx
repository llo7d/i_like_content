import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [isPluginActive, setIsPluginActive] = useState(true);
  const [domainChanges, setDomainChanges] = useState(0);

  const [newDomain, setNewDomain] = useState('');
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    // Load and set defaults
    chrome.storage.local.get(
      ['difficulty', 'category', 'isPluginActive', 'domainChanges', 'excludedDomains'],
      function (result) {
        setDifficulty(result.difficulty);
        setCategory(result.category);
        setIsPluginActive(result.isPluginActive);
        setDomainChanges(result.domainChanges);
        setDomains(result.excludedDomains);

        console.log('result', result);
      }
    );
  }, []);

  const handleAddDomain = () => {
    // Check if the URL is already blocked
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain('');

      // Store the new domain inside chrome storage
      chrome.storage.local.set({ excludedDomains: [...domains, newDomain] });
    }
  };

  const handleRemoveDomain = (urlToRemove) => {
    setDomains(domains.filter((url) => url !== urlToRemove));
    // Remove the domain from the chrome storage
    chrome.storage.local.set({ excludedDomains: domains.filter((url) => url !== urlToRemove) });
  };

  const handleIsPluginActiveChange = (event) => {
    setIsPluginActive(event.target.checked);
    chrome.storage.local.set({ isPluginActive: event.target.checked });

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
        </select>

        <select value={category} onChange={(e) => handleSetcategory(e)}>
          <option value="techy">Technical</option>
          <option value="javascript">Javascript</option>
          <option value="typescript">Typescript</option>
          <option value="python">Python</option>
          <option value="react">React</option>
        </select>

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

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="text" value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="Enter new domain" />
          <button onClick={handleAddDomain}>Add</button>
        </div>

        {domains && domains.map((domain, index) => (
          <div key={index}>
            {domain}
            <button onClick={() => handleRemoveDomain(domain)}>x</button>
          </div>
        ))}

        <br />
        <button onClick={() => {
          chrome.storage.local.set({ seenQuestions: [] });
          alert('Questions reset');
        }}>
          Reset questions
        </button>
      </header>
    </div>
  );
};

export default Popup;
