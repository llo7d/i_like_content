import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [blockedUrls, setBlockedUrls] = useState([]);

  useEffect(() => {
    // Load blocked URLs from Chrome storage when the component mounts
    chrome.storage.sync.get(null, function (items) {
      const urls = Object.keys(items);
      setBlockedUrls(urls);
      console.log('Blocked URLs:', urls);
    });
  }, []);

  const handleSubmit = () => {

    // Check if the URL is already blocked 
    if (blockedUrls.includes(url)) {
      alert('URL already blocked');
      return;
    }

    // Inform the user has to include . it can just be google it has to be google.com
    if (!url.includes('.')) {
      alert('Invalid URL');
      return;
    }


    chrome.storage.sync.set({ [url]: description }, function () {
      // Update the state with the new URL
      setBlockedUrls(prevUrls => [...prevUrls, url]);

    });
  };

  const handleRemoveUrl = (urlToRemove) => {
    // Remove the URL from Chrome storage
    chrome.storage.sync.remove(urlToRemove, function () {
      // Update the state to reflect the change
      setBlockedUrls(blockedUrls.filter(url => url !== urlToRemove));
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Website URL" />
        {/* <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Website Description" /> */}
        <button onClick={handleSubmit}>Save</button>
        {/* Display the blocked URLs */}
        <ul>
          {blockedUrls.map((blockedUrl) => (
            <div key={blockedUrl}>
              {blockedUrl}
              <button onClick={() => handleRemoveUrl(blockedUrl)}>x</button>
            </div>
          ))
          }
        </ul>
      </header>
    </div>
  );
};

export default Popup;