import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [blockedUrls, setBlockedUrls] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [catagory, setCatagory] = useState('javascript');
  const [isPluginActive, setIsPluginActive] = useState(true);
  const [domainChanges, setDomainChanges] = useState(0);

  useEffect(() => {

    // Load isPluginActive from Chrome storage
    chrome.storage.local.get(['isPluginActive'], function (result) {
      setIsPluginActive(result.isPluginActive);
    });
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

    //log local storage value
    chrome.storage.local.get(['domainChanges'], function (result) {
      console.log('Value currently is ' + result.domainChanges);
    });
  };

  function mapDomainChangesToString(domainChanges) {
    if (domainChanges >= 0 && domainChanges <= 5) {
      return 'often';
    } else if (domainChanges > 5 && domainChanges <= 10) {
      return 'somewhat';
    } else if (domainChanges > 10 && domainChanges <= 15) {
      return 'rarely';
    } else {
      return 'invalid';
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <label htmlFor="domainChanges">Choose how often?</label>
        <input
          id="domainChanges"
          type="range"
          min="0"
          max="15"
          value={domainChanges}
          onChange={handleSliderChange}
        />

        <p>You selected: {mapDomainChangesToString(domainChanges)}</p>
        <div className="toggle-container">
          <input
            type="checkbox"
            id="toggle"
            className="toggle-switch-checkbox"
            checked={isPluginActive}
            onChange={(e) => handleIsPluginActiveChange(e)}
          />
          <label className="toggle-switch-slider" htmlFor="toggle"></label>
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="hard">Hard</option>
        </select>{' '}
        <select
          value={difficulty}
          onChange={(e) => setCatagory(e.target.value)}
        >
          <option value="javascript">Fries</option>

          <option value="javascript">Javascript</option>
          <option value="typescript">Typescript</option>
          <option value="python">Python</option>
        </select>{' '}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Website URL"
        /> */}
        {/* <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Website Description" /> */}
        {/* <button onClick={handleSubmit}>Add</button> */}
        {/* Display the blocked URLs */}
        {/* <ul>
          {blockedUrls.map((blockedUrl) => (
            <div key={blockedUrl}>
              {blockedUrl}
              <button onClick={() => handleRemoveUrl(blockedUrl)}>x</button>
            </div>
          ))}
        </ul> */}
      </header>
    </div>
  );
};

export default Popup;
